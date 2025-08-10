import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Plus, LogOut, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FeedbackHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  All Feedback
                </Link>
                <Link
                  to="/feedback/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Link>
                
                <div className="relative ml-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      Welcome, {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Feedback
                </Link>
                <Link
                  to="/feedback/create"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Submit Feedback
                </Link>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center px-3 py-2">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-base font-medium text-gray-800">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
