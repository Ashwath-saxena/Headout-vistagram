import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X, MapPin, Image as ImageIcon, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    caption: '',
    location: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle text input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection
  const handleImageSelect = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setError('');

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      setError('Please select an image to upload');
      return;
    }

    if (!formData.caption.trim()) {
      setError('Please add a caption for your post');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append('image', selectedImage);
      submitData.append('caption', formData.caption.trim());
      if (formData.location.trim()) {
        submitData.append('location', formData.location.trim());
      }

      // Send to your backend API
      const response = await api.post('/posts', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post created successfully:', response.data);
      
      // Redirect to feed on success
      navigate('/', { state: { message: 'Post created successfully! 🎉' } });
    } catch (error) {
      console.error('Error creating post:', error);
      setError(
        error.response?.data?.error || 
        'Failed to create post. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* Background decoration */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary-200 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-float"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-float" style={{ animationDelay: '3s' }}></div>

      <div className={`card p-6 relative overflow-hidden ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
        {/* Card decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600"></div>
        
        {/* Header */}
        <div className={`flex items-center justify-between mb-6 ${mounted ? 'animate-slide-in-down animate-delay-200' : 'opacity-0'}`}>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost p-2 hover:scale-110 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative">
              <Camera className="h-8 w-8 text-primary-500 dark:text-primary-400 animate-float" />
              <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/20 rounded-full blur animate-pulse-soft"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
          </div>
          <Sparkles className="h-6 w-6 text-yellow-500 animate-bounce-gentle" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 animate-scale-in backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className={`${mounted ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Upload Image *</span>
            </label>
            
            {!imagePreview ? (
              // Upload Area
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="relative inline-block">
                    <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300 group-hover:scale-110 transform" />
                    <div className="absolute inset-0 bg-primary-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium mb-2 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {dragActive ? 'Drop your image here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    JPG, PNG, or WEBP (max 5MB)
                  </p>
                </div>
              </div>
            ) : (
              // Image Preview
              <div className="relative group animate-scale-in">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg group-hover:shadow-xl transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg">
                  {selectedImage?.name}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
            )}
            
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Caption */}
          <div className={`${mounted ? 'animate-slide-in-left animate-delay-600' : 'opacity-0'}`}>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Caption *
            </label>
            <textarea
              id="caption"
              name="caption"
              rows="4"
              className="input-field resize-none transition-all duration-200 focus:scale-[1.02]"
              placeholder="Write a caption for your post... ✨"
              value={formData.caption}
              onChange={handleInputChange}
              maxLength="500"
            />
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-gray-500 dark:text-gray-400">
                {formData.caption.length}/500
              </span>
              <div className={`transition-all duration-300 ${formData.caption.length > 400 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.caption.length > 400 && (
                  <span className="animate-pulse">Character limit approaching</span>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className={`${mounted ? 'animate-slide-in-right animate-delay-600' : 'opacity-0'}`}>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              <MapPin className="inline h-4 w-4 mr-1 text-primary-500 dark:text-primary-400" />
              Location (optional)
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="input-field transition-all duration-200 focus:scale-[1.02]"
              placeholder="Add a location... 📍"
              value={formData.location}
              onChange={handleInputChange}
              maxLength="100"
            />
          </div>

          {/* Submit Button */}
          <div className={`flex space-x-4 ${mounted ? 'animate-fade-in animate-delay-800' : 'opacity-0'}`}>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 btn-secondary group"
              disabled={loading}
            >
              <span className="group-hover:scale-105 transition-transform duration-200 inline-block">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={loading || !selectedImage || !formData.caption.trim()}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="relative flex items-center space-x-2">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" type="bounce" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                    <span>Create Post</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>

        {/* User Info */}
        <div className={`mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 ${mounted ? 'animate-fade-in animate-delay-1000' : 'opacity-0'}`}>
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-lg">
              <span className="text-white font-medium">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
              Posting as <strong className="text-gray-900 dark:text-white">@{user?.username}</strong>
            </span>
          </div>
        </div>

        {/* Tips */}
        <div className={`mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 ${mounted ? 'animate-fade-in animate-delay-1200' : 'opacity-0'}`}>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>💡 Tips:</strong> Use engaging captions, add locations to help others discover your posts, and choose high-quality images for the best experience!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
