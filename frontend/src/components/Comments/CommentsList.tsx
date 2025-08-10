import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { FeedbackComment } from '../../types';
import { commentsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Comment from './Comment';
import CommentEditor from './CommentEditor';

interface CommentsListProps {
  feedbackId: number;
  initialComments?: FeedbackComment[];
}

const CommentsList: React.FC<CommentsListProps> = ({ feedbackId, initialComments = [] }) => {
  const [comments, setComments] = useState<FeedbackComment[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.list(feedbackId);
      setComments(response.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  }, [feedbackId]);

  useEffect(() => {
    if (initialComments.length === 0) {
      loadComments();
    } else {
      setComments(initialComments);
    }
  }, [feedbackId, initialComments, loadComments]);

  const handleNewComment = (newComment: FeedbackComment) => {
    setComments(prev => [...prev, newComment]);
    setShowEditor(false);
  };

  const handleUpdateComment = (updatedComment: FeedbackComment) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const handleReply = (newReply: FeedbackComment) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id === newReply.parent_id) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );
  };

  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  if (loading && comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Comments ({totalComments})
        </h3>
        
        {isAuthenticated && !showEditor && (
          <button
            onClick={() => setShowEditor(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Comment
          </button>
        )}
      </div>

      {/* New Comment Editor */}
      {showEditor && (
        <div className="mb-6">
          <CommentEditor
            feedbackId={feedbackId}
            onSubmit={handleNewComment}
            onCancel={() => setShowEditor(false)}
            placeholder="Share your thoughts on this feedback..."
          />
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to share your thoughts on this feedback.
          </p>
          {isAuthenticated && !showEditor && (
            <div className="mt-6">
              <button
                onClick={() => setShowEditor(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add the first comment
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsList;
