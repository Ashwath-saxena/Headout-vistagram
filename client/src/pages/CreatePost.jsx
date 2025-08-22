// client/src/pages/CreatePost.jsx
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

  // Camera-related states
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Camera functions
  const startCamera = async () => {
    try {
      setCameraError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera by default
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please check permissions and try again.');
      setError('Camera access denied. You can still upload a photo from your gallery.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert canvas to blob and create file
      canvas.toBlob((blob) => {
        const file = new File([blob], `captured-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        
        handleImageSelect(file);
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCameraError('');
  };

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
      handleImageSelect(e.dataTransfer.files);
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
      setError('Please select an image or take a photo');
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

  // Check if device has camera
  const hasCameraSupport = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* Background decoration - FIXED with proper containment */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary-200 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

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

        {/* Camera Error */}
        {cameraError && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-xl mb-6 animate-scale-in backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>{cameraError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload/Camera Section */}
          <div className={`${mounted ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Upload Image *</span>
            </label>
            
            {!imagePreview && !showCamera ? (
              // Upload/Camera Options
              <div className="space-y-4">
                {/* Camera Capture Button - Only show if supported */}
                {hasCameraSupport && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-xl hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-300 group"
                  >
                    <Camera className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      📷 Take Photo with Camera
                    </span>
                  </button>
                )}

                {/* Divider */}
                {hasCameraSupport && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or</span>
                    </div>
                  </div>
                )}

                {/* File Upload Area */}
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
                      {dragActive ? 'Drop your image here' : '📁 Upload from Gallery'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                      JPG, PNG, or WEBP (max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : showCamera ? (
              // Camera View
              <div className="relative rounded-xl overflow-hidden bg-black animate-scale-in">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-80 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                    title="Cancel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="bg-white hover:bg-gray-100 text-gray-900 p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 animate-pulse-soft"
                    title="Capture Photo"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                </div>

                {/* Camera Status */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>LIVE</span>
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
                  {selectedImage?.name || 'Captured Photo'}
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
