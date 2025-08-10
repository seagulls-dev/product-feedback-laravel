import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, Edit, Trash2, User, Calendar, MessageSquare } from 'lucide-react';
import { Feedback } from '../types';
import { feedbackAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommentsList from '../components/Comments/CommentsList';

const FeedbackDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeedback = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await feedbackAPI.get(Number(id));
        setFeedback(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [id]);

  const handleUpvote = async () => {
    if (!feedback || !isAuthenticated) return;
    
    try {
      const result = await feedbackAPI.upvote(feedback.id);
      setFeedback(prev => prev ? {
        ...prev,
        upvotes: result.upvotes,
        net_score: result.net_score,
      } : null);
    } catch (error) {
      console.error('Upvote error:', error);
    }
  };

  const handleDownvote = async () => {
    if (!feedback || !isAuthenticated) return;
    
    try {
      const result = await feedbackAPI.downvote(feedback.id);
      setFeedback(prev => prev ? {
        ...prev,
        downvotes: result.downvotes,
        net_score: result.net_score,
      } : null);
    } catch (error) {
      console.error('Downvote error:', error);
    }
  };

  const handleDelete = async () => {
    if (!feedback || !window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await feedbackAPI.delete(feedback.id);
      navigate('/');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {error || 'Feedback not found'}
        </h2>
        <p className="text-gray-600 mb-6">
          The feedback you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feedback List
        </Link>
      </div>
    );
  }

  const canEdit = isAuthenticated && user?.id === feedback.user_id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary-600">
          All Feedback
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{feedback.title}</span>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Title and Status */}
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 pr-4">
                  {feedback.title}
                </h1>
                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feedback.status)}`}
                  >
                    {formatStatus(feedback.status)}
                  </span>
                  {feedback.category && (
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: feedback.category.color ? `${feedback.category.color}20` : '#f3f4f6',
                        color: feedback.category.color || '#374151',
                      }}
                    >
                      {feedback.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {feedback.user.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(feedback.created_at)}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {feedback.topLevelComments?.length || 0} comments
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-6">
                <div className="whitespace-pre-wrap text-gray-700">
                  {feedback.description}
                </div>
              </div>

              {/* Actions */}
              {canEdit && (
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                  <Link
                    to={`/feedback/${feedback.id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Voting Section */}
            <div className="flex flex-col items-center space-y-2 ml-6 bg-gray-50 rounded-lg p-4">
              <button
                onClick={handleUpvote}
                disabled={!isAuthenticated}
                className={`p-2 rounded-lg transition-colors ${
                  !isAuthenticated 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-green-100 cursor-pointer'
                }`}
                title={isAuthenticated ? 'Upvote' : 'Login to vote'}
              >
                <ChevronUp className="h-6 w-6 text-green-600" />
              </button>
              
              <span className="text-lg font-bold text-gray-700 px-2">
                {feedback.net_score}
              </span>
              
              <button
                onClick={handleDownvote}
                disabled={!isAuthenticated}
                className={`p-2 rounded-lg transition-colors ${
                  !isAuthenticated 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-red-100 cursor-pointer'
                }`}
                title={isAuthenticated ? 'Downvote' : 'Login to vote'}
              >
                <ChevronDown className="h-6 w-6 text-red-600" />
              </button>
              
              <div className="text-xs text-gray-500 text-center mt-2">
                <div>{feedback.upvotes} up</div>
                <div>{feedback.downvotes} down</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <CommentsList 
          feedbackId={feedback.id} 
          initialComments={feedback.topLevelComments || []}
        />
      </div>
    </div>
  );
};

export default FeedbackDetail;
