import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, MessageSquare, User, Calendar } from 'lucide-react';
import { Feedback } from '../../types';
import { feedbackAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface FeedbackCardProps {
  feedback: Feedback;
  onVote?: (feedbackId: number, votes: { upvotes: number; downvotes: number; net_score: number }) => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onVote }) => {
  const { isAuthenticated } = useAuth();

  const handleUpvote = async () => {
    if (!isAuthenticated) return;
    
    try {
      const result = await feedbackAPI.upvote(feedback.id);
      onVote?.(feedback.id, {
        upvotes: result.upvotes,
        downvotes: feedback.downvotes,
        net_score: result.net_score,
      });
    } catch (error) {
      console.error('Upvote error:', error);
    }
  };

  const handleDownvote = async () => {
    if (!isAuthenticated) return;
    
    try {
      const result = await feedbackAPI.downvote(feedback.id);
      onVote?.(feedback.id, {
        upvotes: feedback.upvotes,
        downvotes: result.downvotes,
        net_score: result.net_score,
      });
    } catch (error) {
      console.error('Downvote error:', error);
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
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link to={`/feedback/${feedback.id}`} className="group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {feedback.title}
              </h3>
            </Link>
            
            <p className="mt-2 text-gray-600 line-clamp-3">
              {feedback.description}
            </p>

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
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
                {feedback.comments?.length || 0} comments
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}
              >
                {formatStatus(feedback.status)}
              </span>
              
              {feedback.category && (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
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

          {/* Voting Section */}
          <div className="flex flex-col items-center space-y-1 ml-4">
            <button
              onClick={handleUpvote}
              disabled={!isAuthenticated}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              title={isAuthenticated ? 'Upvote' : 'Login to vote'}
            >
              <ChevronUp className="h-5 w-5 text-gray-600 hover:text-green-600" />
            </button>
            
            <span className="text-sm font-semibold text-gray-700 min-w-[24px] text-center">
              {feedback.net_score}
            </span>
            
            <button
              onClick={handleDownvote}
              disabled={!isAuthenticated}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              title={isAuthenticated ? 'Downvote' : 'Login to vote'}
            >
              <ChevronDown className="h-5 w-5 text-gray-600 hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
