import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Camera, Grid, Heart, Users, Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    postsCount: 0,
    likesCount: 0,
    followersCount: 0
  });

  const isOwnProfile = currentUser?.username === username;

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${username}`);
      setProfileUser(response.data.user);
      setStats({
        postsCount: response.data.postsCount || 0,
        likesCount: response.data.totalLikes || 0,
        followersCount: response.data.followersCount || 0
      });
      setError('');
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch user posts
  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await api.get('/posts?limit=50');
      const userPosts = response.data.posts.filter(post => post.user.username === username);
      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [username]);

  // Format join date
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error === 'User not found' 
              ? "This user doesn't exist or may have been deleted."
              : "We couldn't load this profile right now."
            }
          </p>
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Feed</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card p-6 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start mb-4 md:mb-0 animate-scale-in">
            <div className="relative">
              <div className="w-32 h-32 avatar-gradient rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg hover:scale-105 transition-transform duration-300">
                {profileUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-full blur-lg animate-pulse-soft"></div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 animate-slide-in-right">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
                @{profileUser?.username}
              </h1>
              {isOwnProfile && (
                <button className="btn-secondary flex items-center space-x-2 mx-auto md:mx-0 hover:scale-105 transition-transform duration-200">
                  <Settings className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start space-x-8 mb-4 animate-slide-in-left animate-delay-200">
              <div className="text-center group">
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                  {stats.postsCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Posts</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors duration-200">
                  {stats.likesCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Likes</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors duration-200">
                  {stats.followersCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Followers</div>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 dark:text-gray-300 animate-fade-in animate-delay-300">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatJoinDate(profileUser?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="card p-6 animate-fade-in-up animate-delay-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Grid className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isOwnProfile ? 'Your Posts' : `${profileUser?.username}'s Posts`}
            </h2>
            <span className="text-gray-500 dark:text-gray-400">({stats.postsCount})</span>
          </div>
          
          {isOwnProfile && (
            <Link to="/create" className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Camera className="h-4 w-4" />
              <span>New Post</span>
            </Link>
          )}
        </div>

        {/* Posts Loading */}
        {postsLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="md" type="bounce" />
          </div>
        ) : posts.length === 0 ? (
          // Empty Posts State
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
              <Camera className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isOwnProfile ? "You haven't posted yet" : "No posts yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {isOwnProfile 
                ? "Share your first moment with the world!" 
                : `${profileUser?.username} hasn't shared any posts yet.`
              }
            </p>
            {isOwnProfile && (
              <Link to="/create" className="btn-primary inline-flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                <Camera className="h-4 w-4" />
                <span>Create Your First Post</span>
              </Link>
            )}
          </div>
        ) : (
          // Posts Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer animate-fade-in-up hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-4 text-white transform translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-5 w-5" />
                      <span className="font-medium">{post.likesCount}</span>
                    </div>
                    {post.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
                {/* Post indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black bg-opacity-50 rounded-full p-1 backdrop-blur-sm">
                    <Grid className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Stats Card */}
      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up animate-delay-500">
          <div className="card p-6 text-center hover:scale-105 transition-all duration-300 group">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform duration-200">
              {posts.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Posts</div>
          </div>
          <div className="card p-6 text-center hover:scale-105 transition-all duration-300 group">
            <div className="text-2xl font-bold text-red-500 dark:text-red-400 mb-2 group-hover:scale-110 transition-transform duration-200">
              {posts.reduce((sum, post) => sum + post.likesCount, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Likes</div>
          </div>
          <div className="card p-6 text-center hover:scale-105 transition-all duration-300 group">
            <div className="text-2xl font-bold text-green-500 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform duration-200">
              {posts.filter(post => post.location).length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Posts with Location</div>
          </div>
        </div>
      )}

      {/* Recent Activity (if own profile) */}
      {isOwnProfile && posts.length > 0 && (
        <div className="card p-6 animate-fade-in-up animate-delay-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-3">
            {posts.slice(0, 3).map((post, index) => (
              <div 
                key={post.id} 
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group animate-slide-in-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img 
                  src={post.imageUrl} 
                  alt={post.caption}
                  className="w-12 h-12 object-cover rounded-lg group-hover:scale-110 transition-transform duration-200"
                />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {post.caption}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {post.likesCount} likes • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
