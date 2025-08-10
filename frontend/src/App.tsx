import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import FeedbackList from './components/Feedback/FeedbackList';
import FeedbackForm from './components/Feedback/FeedbackForm';
import FeedbackDetail from './pages/FeedbackDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          <Route
            path="/"
            element={
              <Layout>
                <FeedbackList />
              </Layout>
            }
          />
          
          <Route
            path="/feedback/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <FeedbackForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/feedback/:id"
            element={
              <Layout>
                <FeedbackDetail />
              </Layout>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;