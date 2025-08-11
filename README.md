# 🎉 Vistagram - Modern Social Media Platform

> A full-stack social media application built with modern web technologies, featuring real-time interactions, image sharing, and responsive design.

[Live Demo](https://headout-vistagram-5w7w.vercel.app/) • [API Endpoint](https://headout-vistagram-nrf3.vercel.app/api/posts) • [GitHub Repository](https://github.com/Ashwath-saxena/Headout-vistagram)

</div>

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)

## 🎯 Overview

Vistagram is a modern social media platform that allows users to:
- Share photos with captions and locations
- Interact with posts through likes and shares
- Discover content through a personalized timeline
- Experience seamless dark/light mode switching
- Enjoy responsive design across all devices

**Built for:** Headout Full-Stack Developer Assignment  
**Assignment Focus:** Full-stack development with modern UI/UX

## ✨ Features

<details>
<summary><h3>🔐 Authentication & Security</h3></summary>

- JWT-based authentication system
- Secure user registration and login
- Protected routes and API endpoints
- Password validation and security
</details>

<details>
<summary><h3>📸 Media & Content</h3></summary>

- Real-time image upload to Cloudinary CDN
- Drag & drop file upload interface
- Image optimization and responsive delivery
- Location tagging for posts
</details>

<details>
<summary><h3>🎨 User Experience</h3></summary>

- **Dark/Light Mode Toggle** - Seamless theme switching
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Smooth Animations** - Professional micro-interactions
- **Loading States** - Enhanced user feedback
</details>

<details>
<summary><h3>📱 Social Features</h3></summary>

- Timeline/Feed with pagination
- Like functionality
- User profiles with post galleries
- Real-time interaction updates
</details>

## 🛠 Tech Stack

<table>
<tr>
<th>Frontend</th>
<th>Backend</th>
<th>DevOps & Deployment</th>
</tr>
<tr>
<td>

- **React 18**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Lucide React**

</td>
<td>

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **Cloudinary**
- **JWT**

</td>
<td>

- **Vercel**
- **Railway**
- **Git**
- **Environment Variables**

</td>
</tr>
</table>

## 🏗 Architecture

```mermaid
graph TD
    A[React Client] -->|API Calls| B[Express API]
    B -->|Database Queries| C[PostgreSQL DB]
    B -->|Image Storage| D[Cloudinary]
    A -->|Deployment| E[Vercel Frontend]
    B -->|Deployment| F[Vercel Backend]
    C -->|Hosting| G[Railway DB]
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Railway account)
- Cloudinary account
- Git installed

<details>
<summary><h3>1. Clone Repository</h3></summary>

```bash
git clone https://github.com/Ashwath-saxena/Headout-vistagram.git
cd Headout-vistagram
```
</details>

<details>
<summary><h3>2. Backend Setup</h3></summary>

```bash
cd server
npm install

# Create .env file with:
DATABASE_URL=your_railway_postgresql_url
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
</details>

<details>
<summary><h3>3. Frontend Setup</h3></summary>

```bash
cd ../client
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```
</details>

### 4. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Health:** http://localhost:5000/api/health

## 📚 API Documentation

<details>
<summary><h3>Authentication Endpoints</h3></summary>

```http
POST /api/auth/register - User registration
POST /api/auth/login    - User login
GET  /api/auth/me      - Get current user
```
</details>

<details>
<summary><h3>Posts Endpoints</h3></summary>

```http
GET  /api/posts         - Get all posts (timeline)
POST /api/posts         - Create new post (with image)
GET  /api/posts/:id     - Get specific post
POST /api/posts/:id/like - Like/unlike post
```
</details>

<details>
<summary><h3>User Endpoints</h3></summary>

```http
GET /api/users/:username - Get user profile
```
</details>

## 🌐 Deployment

### Production URLs
- **Frontend:** https://headout-vistagram-5w7w.vercel.app
- **Backend:** https://headout-vistagram-nrf3.vercel.app

### Deployment Stack
- **Frontend Hosting:** Vercel (Static Site)
- **Backend Hosting:** Vercel (Serverless Functions)
- **Database:** Railway PostgreSQL
- **Image Storage:** Cloudinary CDN
- **Domain Management:** Vercel DNS

<details>
<summary><h3>Environment Variables</h3></summary>

```env
# Backend (.env)
DATABASE_URL=postgresql://postgres:PASSWORD@trolley.proxy.rlwy.net:PORT/railway
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production

# Frontend (Vercel Environment Variables)
VITE_API_URL=https://headout-vistagram-nrf3.vercel.app/api
```
</details>

## 🎯 Key Implementation Highlights

<details>
<summary><h3>1. Advanced UI/UX</h3></summary>

- Custom Tailwind CSS configuration with dark mode
- Smooth animations and micro-interactions
- Responsive design with mobile-first approach
- Professional glassmorphism effects
</details>

<details>
<summary><h3>2. Robust Backend Architecture</h3></summary>

- RESTful API design with proper HTTP status codes
- JWT authentication with middleware protection
- File upload handling with Multer and Cloudinary
- Database relationships with Prisma ORM
</details>

<details>
<summary><h3>3. Production-Ready Features</h3></summary>

- Environment-based configuration
- Error handling and validation
- CORS configuration for cross-origin requests
- Secure authentication flow
</details>

<details>
<summary><h3>4. Performance Optimizations</h3></summary>

- Image optimization with Cloudinary
- Lazy loading for images
- Efficient pagination for posts
- Optimized bundle sizes with Vite
</details>

## 🧪 Testing

### Test Results
| Category | Status |
|----------|---------|
| User Authentication | ✅ Passed |
| Image Upload | ✅ Passed |
| Post Creation | ✅ Passed |
| Like Functionality | ✅ Passed |
| Responsive Design | ✅ Passed |
| Dark/Light Mode | ✅ Passed |
| API Endpoints | ✅ Passed |

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

<div align="center">

**Developer:** Ashwath Saxena  
**Email:** [[My_Email](work.ashwathsaxena.as@gmail.com)]  
**LinkedIn:** [[My LinkedIn Profile](https://www.linkedin.com/in/ashwath-saxena/)]  
**Portfolio:** [[My Portfolio URL](https://portfolio-ashwath-saxena.vercel.app/)] 
**Github:** [[My Github URL](https://github.com/Ashwath-saxena)]

---

**Built with ❤️ for Headout - Showcasing modern full-stack development skills**

</div>
