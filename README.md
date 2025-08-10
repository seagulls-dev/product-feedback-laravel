# Feedback Management System

A full-stack web application for managing user feedback with modern React frontend and Laravel backend API.

## 🎯 Overview

This project is a complete feedback management system that allows users to submit, organize, and discuss feedback items. It features user authentication, categorized feedback, voting system, and threaded comments with markdown support.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (React)       │◄──►│   (Laravel)     │
│                 │    │                 │
│ - User Interface│    │ - REST API      │
│ - State Mgmt    │    │ - Authentication│
│ - Routing       │    │ - Database      │
│ - Components    │    │ - Business Logic│
└─────────────────┘    └─────────────────┘
```

## 🚀 Key Features

### Core Functionality
- **User Authentication**: Secure login/registration with JWT tokens
- **Feedback Management**: Create, read, update, delete feedback items
- **Categories**: Organize feedback by categories with color coding
- **Voting System**: Upvote and downvote feedback items
- **Threaded Comments**: Nested comments with markdown support and user mentions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Technical Features
- **Real-time Updates**: Dynamic content without page refresh
- **Form Validation**: Client and server-side validation
- **API Rate Limiting**: Protection against abuse
- **Database Optimization**: Efficient queries with proper indexing
- **Security**: XSS protection, SQL injection prevention, CORS handling

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router v7** - Client-side routing
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Laravel 12** - PHP framework
- **Laravel Sanctum** - API authentication
- **MySQL/PostgreSQL** - Database
- **Eloquent ORM** - Database abstraction
- **League CommonMark** - Markdown processing
- **PHP 8.2+** - Modern PHP

## 📁 Project Structure

```
feedback-management-system/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript definitions
│   ├── package.json
│   └── README.md
│
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # API controllers
│   │   └── Models/               # Eloquent models
│   ├── database/
│   │   ├── migrations/          # Database schema
│   │   └── seeders/            # Database seeders
│   ├── routes/api.php          # API routes
│   ├── composer.json
│   └── README.md
│
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PHP 8.2+ and Composer
- MySQL 8.0+ or PostgreSQL 12+


### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure database in .env file
php artisan migrate
php artisan db:seed
php artisan serve
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

npm start
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

### Feedback Endpoints
- `GET /api/feedback` - List all feedback
- `POST /api/feedback` - Create feedback
- `GET /api/feedback/{id}` - Get specific feedback
- `PUT /api/feedback/{id}` - Update feedback
- `DELETE /api/feedback/{id}` - Delete feedback
- `POST /api/feedback/{id}/upvote` - Upvote feedback
- `POST /api/feedback/{id}/downvote` - Downvote feedback

### Comment Endpoints
- `GET /api/feedback/{id}/comments` - Get comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and authentication
- **feedback_categories** - Categories for organizing feedback
- **feedback** - Main feedback items with voting
- **feedback_comments** - Threaded comments with markdown

### Key Relationships
- Users can create multiple feedback items
- Feedback belongs to categories
- Comments can be nested (threaded)
- Users can vote on feedback items

## 🔒 Security Features

### Frontend Security
- Protected routes with authentication
- Form validation with Yup schemas
- XSS protection for markdown content
- Secure token storage

### Backend Security
- JWT authentication with Laravel Sanctum
- Input validation and sanitization
- SQL injection protection via Eloquent
- CORS configuration for frontend integration
- Rate limiting on API endpoints

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
php artisan test
```

## 🚀 Deployment

### Frontend Deployment
- Build: `npm run build`
- Deploy to: Netlify, Vercel, AWS S3, or traditional hosting

### Backend Deployment
- Production setup with Laravel Forge, Vapor, or traditional VPS
- Database migration: `php artisan migrate --force`
- Cache optimization: `php artisan config:cache`

## 📊 Performance

### Frontend Optimization
- Code splitting and lazy loading
- Optimized bundle size
- Efficient state management
- Responsive design

### Backend Optimization
- Database indexing on frequently queried columns
- Eager loading to prevent N+1 queries
- API response caching
- Efficient pagination


### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure both frontend and backend work together


## 🔗 Links

- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
- [API Routes](backend/routes/api.php)


**Built with using React and Laravel**
