// server/routes/posts.js
import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Add this temporary test route to verify Cloudinary is working
router.get('/test-cloudinary', (req, res) => {
  res.json({
    message: 'Cloudinary config test',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
    apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
    apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
  });
});


// Create post with image upload
// Replace the placeholder route with this REAL image upload route
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { caption, location } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Check if caption is provided
    if (!caption || caption.trim().length === 0) {
      return res.status(400).json({ error: 'Caption is required' });
    }

    // Create post with real uploaded image
    const post = await prisma.post.create({
      data: {
        caption: caption.trim(),
        location: location?.trim() || null,
        imageUrl: req.file.path,           // Real Cloudinary URL
        imagePublicId: req.file.filename,  // Real Cloudinary public ID
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            shares: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        ...post,
        likesCount: post._count.likes,
        sharesCount: post._count.shares,
        _count: undefined
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    
    // Clean up uploaded image if database save fails
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (deleteError) {
        console.error('Error deleting image:', deleteError);
      }
    }
    
    res.status(500).json({ error: 'Failed to create post' });
  }
});



// Get all posts (timeline)
// Get all posts (timeline) - FIXED: removed /:id parameter
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        likes: req.user ? {
          where: { userId: req.user.id },
          select: { id: true }
        } : false,
        _count: {
          select: {
            likes: true,
            shares: true
          }
        }
      }
    });

    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      sharesCount: post._count.shares,
      isLiked: req.user ? post.likes.length > 0 : false,
      likes: undefined,
      _count: undefined
    }));

    const totalPosts = await prisma.post.count();
    const hasMore = skip + limit < totalPosts;

    res.json({
      posts: postsWithLikeStatus,
      pagination: {
        page,
        limit,
        total: totalPosts,
        hasMore
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


// Add this route for getting a single post by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        likes: req.user ? {
          where: { userId: req.user.id },
          select: { id: true }
        } : false,
        _count: {
          select: {
            likes: true,
            shares: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postWithLikeStatus = {
      ...post,
      likesCount: post._count.likes,
      sharesCount: post._count.shares,
      isLiked: req.user ? post.likes.length > 0 : false,
      likes: undefined,
      _count: undefined
    };

    res.json({ post: postWithLikeStatus });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});


// Like/Unlike post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id
        }
      }
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id }
        }),
        prisma.post.update({
          where: { id },
          data: { likesCount: { decrement: 1 } }
        })
      ]);

      res.json({ 
        message: 'Post unliked',
        isLiked: false 
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: { userId, postId: id }
        }),
        prisma.post.update({
          where: { id },
          data: { likesCount: { increment: 1 } }
        })
      ]);

      res.json({ 
        message: 'Post liked',
        isLiked: true 
      });
    }
  } catch (error) {
    console.error('Like/unlike error:', error);
    res.status(500).json({ error: 'Failed to like/unlike post' });
  }
});

// Share post
router.post('/:id/share', async (req, res) => {
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await prisma.$transaction([
      prisma.share.create({
        data: { 
          postId: id,
          ipAddress 
        }
      }),
      prisma.post.update({
        where: { id },
        data: { sharesCount: { increment: 1 } }
      })
    ]);

    res.json({ 
      message: 'Post shared successfully',
      shareUrl: `${process.env.CLIENT_URL}/post/${id}`
    });
  } catch (error) {
    console.error('Share error:', error);
    res.status(500).json({ error: 'Failed to share post' });
  }
});

export default router;
