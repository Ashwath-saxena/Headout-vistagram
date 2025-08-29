// client/src/pages/Feed.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import BookmarkedPosts from '../components/BookmarkedPosts';

const Feed = () => {
  // ✨ MAIN FIX: Move bookmark state here
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarks') || '[]';
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [showBookmarks, setShowBookmarks] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    hasMore: false,
    total: 0
  });

  const { user } = useAuth();

  // ✨ Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }, [bookmarks]);

  // ✨ Bookmark toggle function
  const toggleBookmark = (postId) => {
    setBookmarks(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)  // Remove
        : [...prev, postId]                 // Add
    );
  };

  // ✨ Check if post is bookmarked
  const isBookmarked = (postId) => bookmarks.includes(postId);

  // Your existing fetchPosts function...
  const fetchPosts = async (page = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (page === 1) {
        setLoading(true);
      }

      const response = await api.get(`/posts?page=${page}&limit=10`);
      const { posts: newPosts, pagination: paginationData } = response.data;

      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setPagination({
        page: paginationData.page,
        hasMore: paginationData.hasMore,
        total: paginationData.total
      });

      setError('');
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle like/unlike
  const handleLike = (postId, isLiked) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked,
              likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1
            }
          : post
      )
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPosts(1, true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => fetchPosts()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-primary-500 dark:text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Vistagram! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your timeline is empty. Start by creating your first post!
          </p>
          <Link to="/create" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Your First Post</span>
          </Link>
        </div>
      </div>
    );
  }

  // Posts feed
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ✨ FIXED: Tab Navigation */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setShowBookmarks(false)}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            !showBookmarks
              ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setShowBookmarks(true)}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center space-x-2 ${
            showBookmarks
              ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Bookmarks</span>
          {bookmarks.length > 0 && (
            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
              {bookmarks.length}
            </span>
          )}
        </button>
      </div>

      {/* ✨ FIXED: Conditional Content */}
      {showBookmarks ? (
        <BookmarkedPosts 
          allPosts={posts} 
          bookmarks={bookmarks} 
          toggleBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feed</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {pagination.total} {pagination.total === 1 ? 'post' : 'posts'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Refresh feed"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link to="/create" className="btn-primary">
                <Plus className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Welcome Message for New Users */}
          {posts.length === 1 && posts[0].user.id === user?.id && (
            <div className="card p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-700">
              <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">
                🎉 Congratulations on your first post!
              </h3>
              <p className="text-primary-700 dark:text-primary-300 text-sm">
                Your Vistagram journey has begun. Keep sharing your amazing moments!
              </p>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <PostCard 
                key={`${post.id}-${index}`} 
                post={post} 
                onLike={handleLike}
                toggleBookmark={toggleBookmark}
                isBookmarked={isBookmarked}
                index={index}
              />
            ))}
          </div>

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="text-center py-6">
              <button
                onClick={() => fetchPosts(pagination.page + 1)}
                className="btn-secondary"
              >
                Load More Posts
              </button>
            </div>
          )}

          {/* End Message */}
          {!pagination.hasMore && posts.length > 0 && (
            <div className="text-center py-6 text-gray-600 dark:text-gray-300">
              <p>You've seen all posts! 🎉</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
