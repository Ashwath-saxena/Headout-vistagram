// server/routes/users.js
import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Get user profile
// Get user profile
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get total likes for user's posts
    const userPosts = await prisma.post.findMany({
      where: { userId: user.id },
      select: { _count: { select: { likes: true } } }
    });

    const totalLikes = userPosts.reduce((sum, post) => sum + post._count.likes, 0);

    res.json({
      user,
      postsCount: user._count.posts,
      totalLikes,
      followersCount: 0, // Placeholder for future followers feature
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});


export default router;
