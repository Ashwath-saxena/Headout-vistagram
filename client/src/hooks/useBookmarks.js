// client/src/hooks/useBookmarks.js
import { useState, useEffect } from 'react';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem('bookmarks') || '[]';
    setBookmarks(JSON.parse(saved));
  }, []);

  // Save bookmarks when changed
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggle = (id) => {
    setBookmarks(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)  // Remove
        : [...prev, id]               // Add
    );
  };

  return { bookmarks, toggle, has: (id) => bookmarks.includes(id) };
};
