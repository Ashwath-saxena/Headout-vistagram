// client/src/components/BookmarkedPosts.jsx
import React from 'react';
import { Bookmark } from 'lucide-react';
// ✨ REMOVE: import { useBookmarks } from '../hooks/useBookmarks';
import PostCard from './PostCard';

const BookmarkedPosts = ({ allPosts, bookmarks, toggleBookmark, isBookmarked }) => {
  // ✨ REMOVE: const { bookmarks } = useBookmarks();
  
  const bookmarkedPosts = allPosts.filter(post => bookmarks.includes(post.id));

  console.log('BookmarkedPosts debug:', {
    totalBookmarks: bookmarks.length,
    totalPosts: allPosts.length,
    bookmarkedPostsFound: bookmarkedPosts.length,
    bookmarkIds: bookmarks,
    postIds: allPosts.map(p => p.id)
  });

  if (bookmarkedPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No bookmarks yet!</h3>
        <p className="text-gray-500">
          Bookmarks in storage: {bookmarks.length}<br/>
          Available posts: {allPosts.length}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Bookmarked Posts ({bookmarkedPosts.length})
        </h2>
      </div>
      
      {bookmarkedPosts.map((post, index) => (
        <PostCard
          key={`bookmark-${post.id}`}
          post={post}
          onLike={() => {}}
          toggleBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
          index={index}
        />
      ))}
    </div>
  );
};

export default BookmarkedPosts;
