# 🎉 Vistagram - Modern Social Media Platform

> A full-stack social media application built with modern web technologies, featuring real-time interactions, image sharing, and responsive design.

![Vistagram Demo](./assets/app-demo.gif)

## 🚀 Live Demo

**Frontend:** https://vistagram-frontend.vercel.app  
**Backend API:** https://vistagram-backend.vercel.app

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

## 🎯 Overview

Vistagram is a modern social media platform that allows users to:
- Share photos with captions and locations
- Interact with posts through likes and shares
- Discover content through a personalized timeline
- Experience seamless dark/light mode switching
- Enjoy responsive design across all devices

**Built for:** Headout Full-Stack Developer Assignment  
**Development Time:** [Your timeframe]  
**Assignment Focus:** Full-stack development with modern UI/UX

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication system
- Secure user registration and login
- Protected routes and API endpoints
- Password validation and security

### 📸 Media & Content
- Real-time image upload to Cloudinary CDN
- Drag & drop file upload interface
- Image optimization and responsive delivery
- Location tagging for posts

### 🎨 User Experience
- **Dark/Light Mode Toggle** - Seamless theme switching
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Smooth Animations** - Professional micro-interactions
- **Loading States** - Enhanced user feedback

### 📱 Social Features
- Timeline/Feed with pagination
- Like and share functionality
- User profiles with post galleries
- Real-time interaction updates

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast development and build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database client
- **Cloudinary** - Image storage and optimization
- **JWT** - JSON Web Tokens for authentication

### DevOps & Deployment
- **Vercel** - Serverless deployment platform
- **Railway/Neon** - PostgreSQL cloud hosting
- **Git** - Version control
- **Environment Variables** - Secure configuration

## 🏗 Architecture

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ React Client    │───▶│ Express API    │───▶│ PostgreSQL DB  │
│ (Port 3000)    │ │ (Port 5000)    │ │ (Cloud)        │
└─────────────────┘ └─────────────────┘ └─────────────────┘
        │                   │                   │
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Vercel Frontend │ │ Vercel Backend  │ │ Railway/Neon DB │
│ Deployment      │ │ Deployment      │ │ Hosting         │
└─────────────────┘ └─────────────────┘ └─────────────────┘
        │
        ▼
┌─────────────────┐
│ Cloudinary      │
│ Image Storage   │
└─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Cloudinary account
- Git installed

### 1. Clone Repository
```bash
git clone https://github.com/your-username/vistagram-social-media-app.git
cd vistagram-social-media-app
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Add your environment variables:
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

### 4. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Health:** http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/me - Get current user
```

### Posts Endpoints
```
GET /api/posts - Get all posts (timeline)
POST /api/posts - Create new post (with image)
GET /api/posts/:id - Get specific post
POST /api/posts/:id/like - Like/unlike post
POST /api/posts/:id/share - Share post
```

### User Endpoints
```
GET /api/users/:username - Get user profile
```

**📖 [Full API Documentation](./docs/API_DOCUMENTATION.md)**

## 🌐 Deployment

### Production URLs
- **Frontend:** https://vistagram-frontend.vercel.app
- **Backend:** https://vistagram-backend.vercel.app

### Deployment Stack
- **Frontend Hosting:** Vercel (Static Site)
- **Backend Hosting:** Vercel (Serverless Functions)
- **Database:** Railway PostgreSQL
- **Image Storage:** Cloudinary CDN
- **Domain Management:** Vercel DNS

**📖 [Deployment Guide](./docs/DEPLOYMENT.md)**

## 🎯 Key Implementation Highlights

### 1. **Advanced UI/UX**
- Custom Tailwind CSS configuration with dark mode
- Smooth animations and micro-interactions
- Responsive design with mobile-first approach
- Professional glassmorphism effects

### 2. **Robust Backend Architecture**
- RESTful API design with proper HTTP status codes
- JWT authentication with middleware protection
- File upload handling with Multer and Cloudinary
- Database relationships with Prisma ORM

### 3. **Production-Ready Features**
- Environment-based configuration
- Error handling and validation
- CORS configuration for cross-origin requests
- Secure authentication flow

### 4. **Performance Optimizations**
- Image optimization with Cloudinary
- Lazy loading for images
- Efficient pagination for posts
- Optimized bundle sizes with Vite

## 🧪 Testing

### Manual Testing Completed
- ✅ User registration and authentication
- ✅ Image upload and storage
- ✅ Post creation and timeline display
- ✅ Like/unlike functionality
- ✅ Responsive design across devices
- ✅ Dark/light mode switching
- ✅ API endpoint functionality

### Browser Compatibility
- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)

## 🏆 Assignment Requirements Met

- ✅ **Full-Stack Application** - Complete frontend and backend
- ✅ **Modern Tech Stack** - React, Node.js, PostgreSQL
- ✅ **Responsive Design** - Works on all devices
- ✅ **Database Integration** - PostgreSQL with relationships
- ✅ **Image Upload** - Cloudinary integration
- ✅ **Authentication** - JWT-based security
- ✅ **Deployment** - Production-ready on Vercel
- ✅ **Clean Code** - Well-structured and documented

## 📞 Contact

**Developer:** Ashwath Saxena

---

**Built with ❤️ for Headout - Showcasing modern full-stack development skills**