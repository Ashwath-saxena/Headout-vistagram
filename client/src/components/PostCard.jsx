import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MapPin, MoreHorizontal, Bookmark } from 'lucide-react';
import api from '../utils/api';

const PostCard = ({ post, onLike, index = 0 }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await api.post(`/posts/${post.id}/like`);
      onLike(post.id, !post.isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return `${Math.floor(diffInHours / 24)}d`;
    }
  };

  return (
    <div 
      className="card-interactive animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 avatar-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-semibold text-lg">
                {post.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-primary-600/30 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
              @{post.user.username}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <button className="btn-ghost">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Image */}
      <div className="relative overflow-hidden">
        <div className={`relative transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <img 
            src={post.imageUrl} 
            alt={post.caption}
            className="w-full h-96 object-cover hover:scale-105 transition-transform duration-700"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-1 transition-all duration-300 transform active:scale-90 ${
                post.isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-red-500'
              } ${isLiking ? 'animate-pulse' : ''}`}
            >
              <Heart 
                className={`h-6 w-6 transition-all duration-300 ${
                  post.isLiked ? 'fill-current scale-110' : 'hover:scale-110'
                }`} 
              />
              <span className="font-medium text-gray-900 dark:text-white">{post.likesCount}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all duration-200 transform hover:scale-110 active:scale-90">
              <MessageCircle className="h-6 w-6" />
              <span className="font-medium text-gray-900 dark:text-white">0</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all duration-200 transform hover:scale-110 active:scale-90">
              <Share className="h-6 w-6" />
              <span className="font-medium text-gray-900 dark:text-white">{post.sharesCount}</span>
            </button>
          </div>
          
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`transition-all duration-300 transform hover:scale-110 active:scale-90 ${
              isBookmarked 
                ? 'text-yellow-500' 
                : 'text-gray-700 dark:text-gray-200 hover:text-yellow-500'
            }`}
          >
            <Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
            <span className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 cursor-pointer">
              @{post.user.username}
            </span>{' '}
            <span className="text-gray-800 dark:text-gray-100">{post.caption}</span>
          </p>
        </div>

        {/* Location */}
        {post.location && (
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 text-sm hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200">
            <MapPin className="h-4 w-4" />
            <span>{post.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
