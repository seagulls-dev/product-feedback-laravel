# Feedback Management System - Backend API

A robust Laravel 12 API for managing user feedback with authentication, categories, voting, and threaded comments.

## 🚀 Features

- **User Authentication**: JWT-based authentication with Laravel Sanctum
- **Feedback Management**: CRUD operations for feedback items
- **Categories**: Organize feedback by categories with color coding
- **Voting System**: Upvote and downvote functionality
- **Threaded Comments**: Nested comments with markdown support and user mentions
- **API Documentation**: RESTful API with comprehensive endpoints
- **Database Migrations**: Automated database schema management
- **Validation**: Robust input validation and error handling
- **Pagination**: Efficient data pagination for large datasets

## 🛠️ Tech Stack

- **Laravel 12** - Modern PHP framework
- **Laravel Sanctum** - API authentication
- **MySQL/PostgreSQL** - Database (configurable)
- **Eloquent ORM** - Database abstraction layer
- **League CommonMark** - Markdown processing
- **PHP 8.2+** - Modern PHP features

## 📁 Project Structure

```
app/
├── Http/Controllers/Api/    # API controllers
│   ├── AuthController.php
│   ├── FeedbackController.php
│   ├── FeedbackCategoryController.php
│   └── FeedbackCommentController.php
├── Models/                  # Eloquent models
│   ├── User.php
│   ├── Feedback.php
│   ├── FeedbackCategory.php
│   └── FeedbackComment.php
└── Providers/              # Service providers

database/
├── migrations/             # Database migrations
├── seeders/               # Database seeders
└── factories/             # Model factories

routes/
└── api.php               # API route definitions
```

## 🚀 Getting Started

### Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL/PostgreSQL database
- Node.js (for frontend assets)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure Database**
   Update your `.env` file with database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=feedback_system
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run Migrations and Seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Start the Development Server**
   ```bash
   php artisan serve
   ```

   The API will be available at [http://localhost:8000](http://localhost:8000)

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |
| POST | `/api/logout` | Logout user (authenticated) |
| GET | `/api/me` | Get current user info (authenticated) |

### Feedback Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feedback-categories` | Get all categories |

### Feedback

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feedback` | Get all feedback (public) |
| GET | `/api/feedback/{id}` | Get specific feedback (public) |
| POST | `/api/feedback` | Create feedback (authenticated) |
| PUT | `/api/feedback/{id}` | Update feedback (authenticated) |
| DELETE | `/api/feedback/{id}` | Delete feedback (authenticated) |
| POST | `/api/feedback/{id}/upvote` | Upvote feedback (authenticated) |
| POST | `/api/feedback/{id}/downvote` | Downvote feedback (authenticated) |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feedback/{id}/comments` | Get comments for feedback (public) |
| POST | `/api/comments` | Create comment (authenticated) |
| GET | `/api/comments/{id}` | Get specific comment (authenticated) |
| PUT | `/api/comments/{id}` | Update comment (authenticated) |
| DELETE | `/api/comments/{id}` | Delete comment (authenticated) |
| GET | `/api/users/search` | Search users for mentions (authenticated) |

## 🔧 Configuration

### CORS Configuration

Update `config/cors.php` for frontend integration:

```php
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### Sanctum Configuration

Configure token expiration in `config/sanctum.php`:

```php
'expiration' => 60 * 24 * 7, // 7 days
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `email_verified_at` - Email verification timestamp
- `created_at`, `updated_at` - Timestamps

### Feedback Categories Table
- `id` - Primary key
- `name` - Category name (unique)
- `description` - Category description
- `color` - Hex color code for UI
- `is_active` - Active status
- `created_at`, `updated_at` - Timestamps

### Feedback Table
- `id` - Primary key
- `title` - Feedback title
- `description` - Feedback content
- `user_id` - Foreign key to users
- `feedback_category_id` - Foreign key to categories
- `status` - Enum: open, in_progress, completed, rejected
- `upvotes` - Upvote count
- `downvotes` - Downvote count
- `created_at`, `updated_at` - Timestamps

### Feedback Comments Table
- `id` - Primary key
- `content` - Comment text
- `content_html` - Processed HTML content
- `user_id` - Foreign key to users
- `feedback_id` - Foreign key to feedback
- `parent_id` - Self-referencing for threaded comments
- `mentioned_users` - JSON array of mentioned user IDs
- `created_at`, `updated_at` - Timestamps

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation rules
- **SQL Injection Protection**: Eloquent ORM protection
- **XSS Protection**: HTML content sanitization
- **Rate Limiting**: API rate limiting (configurable)
- **CORS Protection**: Cross-origin request handling

## 🧪 Testing

Run tests with:
```bash
php artisan test
```

The project includes:
- Unit tests for models
- Feature tests for API endpoints
- Database testing with factories

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Database Migration**
   ```bash
   php artisan migrate --force
   ```

3. **Queue Workers** (if using queues)
   ```bash
   php artisan queue:work
   ```

### Server Requirements

- PHP 8.2+
- MySQL 8.0+ or PostgreSQL 12+
- Composer
- Web server (Apache/Nginx)

### Deployment Options

- **Laravel Forge**: Automated deployment
- **Laravel Vapor**: Serverless deployment
- **DigitalOcean App Platform**: Managed deployment
- **Traditional VPS**: Manual deployment

## 📊 Performance Optimization

- **Database Indexing**: Optimized indexes on frequently queried columns
- **Eager Loading**: Prevents N+1 query problems
- **Caching**: Route and config caching
- **Pagination**: Efficient data pagination
- **API Rate Limiting**: Prevents abuse

## 🔧 Development Commands

```bash
# Development server
php artisan serve

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Seed database
php artisan db:seed

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Run tests
php artisan test

# Generate API documentation
php artisan route:list --path=api
```

## 🔗 Related

- [Frontend Application](../frontend/README.md)
- [API Documentation](routes/api.php)
- [Laravel Documentation](https://laravel.com/docs)
