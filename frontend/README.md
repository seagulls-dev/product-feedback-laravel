# Feedback Management System - Frontend

A modern React TypeScript application for managing user feedback, built with React 19, TypeScript, Tailwind CSS, and React Router.

## 🚀 Features

- **User Authentication**: Login and registration with JWT tokens
- **Feedback Management**: Create, view, edit, and delete feedback items
- **Categories**: Organize feedback by categories with color coding
- **Voting System**: Upvote and downvote feedback items
- **Comments**: Threaded comments with markdown support and user mentions
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Protected Routes**: Secure access to authenticated features
- **Real-time Updates**: Dynamic content updates without page refresh

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **React Hook Form** - Form handling with validation
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icons
- **React Markdown** - Markdown rendering for comments
- **Yup** - Schema validation

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Comments/       # Comment-related components
│   ├── Feedback/       # Feedback management components
│   └── Layout/         # Layout and navigation components
├── contexts/           # React contexts (AuthContext)
├── pages/              # Page components
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API server running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The application will open at [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🔧 Configuration

### API Configuration

The frontend communicates with the Laravel backend API. Configure the API URL in your `.env` file:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Authentication

The app uses JWT tokens stored in localStorage for authentication. The `AuthContext` manages user state and token handling.

## 🎨 UI Components

### Core Components

- **Layout**: Main application layout with header and navigation
- **FeedbackList**: Displays all feedback items with filtering and pagination
- **FeedbackForm**: Create and edit feedback items
- **FeedbackCard**: Individual feedback item display
- **CommentsList**: Threaded comments with markdown support
- **CommentEditor**: Rich text editor for comments with user mentions

### Styling

The application uses Tailwind CSS for styling with custom components and responsive design. The UI is modern and accessible with proper contrast and keyboard navigation.

## 🔒 Security Features

- **Protected Routes**: Authentication-required routes
- **Token Management**: Secure JWT token handling
- **Input Validation**: Form validation with Yup schemas
- **XSS Protection**: Sanitized markdown rendering

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🧪 Testing

Run tests with:
```bash
npm test
```

The project includes:
- Unit tests for components
- Integration tests for API calls
- Accessibility testing

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deployment Options

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your repository for automatic deployments
- **AWS S3**: Upload the `build` folder to an S3 bucket
- **Traditional hosting**: Upload files to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related

- [Backend API Documentation](../backend/README.md)
- [API Endpoints](../backend/routes/api.php)
