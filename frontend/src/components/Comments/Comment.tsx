import React, { useState } from 'react';
import { MessageSquare, Edit, Trash2, Reply, MoreHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FeedbackComment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { commentsAPI } from '../../services/api';
import CommentEditor from './CommentEditor';

interface CommentProps {
  comment: FeedbackComment;
  onUpdate: (comment: FeedbackComment) => void;
  onDelete: (commentId: number) => void;
  onReply: (comment: FeedbackComment) => void;
  depth?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onUpdate,
  onDelete,
  onReply,
  depth = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const canEdit = isAuthenticated && user?.id === comment.user_id;
  const canReply = isAuthenticated && depth < 3; // Limit nesting to 3 levels

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? 'just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    setIsUpdating(true);
    try {
      const response = await commentsAPI.update(comment.id, {
        content: editContent.trim(),
      });
      onUpdate(response.comment);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsAPI.delete(comment.id);
      onDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleReplySubmit = (newComment: FeedbackComment) => {
    onReply(newComment);
    setIsReplying(false);
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {comment.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900">{comment.user.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                {formatDate(comment.created_at)}
                {comment.created_at !== comment.updated_at && (
                  <span className="ml-1">(edited)</span>
                )}
              </span>
            </div>
          </div>

          {canEdit && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 z-10 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={isUpdating || !editContent.trim()}
                className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none mb-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {comment.content_html || comment.content}
            </ReactMarkdown>
          </div>
        )}

        {!isEditing && (
          <div className="flex items-center space-x-4 text-sm">
            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center text-gray-500 hover:text-primary-600"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </button>
            )}
            
            {comment.replies && comment.replies.length > 0 && (
              <span className="flex items-center text-gray-500">
                <MessageSquare className="h-3 w-3 mr-1" />
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>
        )}

        {isReplying && (
          <div className="mt-4">
            <CommentEditor
              feedbackId={comment.feedback_id}
              parentId={comment.id}
              onSubmit={handleReplySubmit}
              onCancel={() => setIsReplying(false)}
              placeholder="Write a reply..."
              submitLabel="Post Reply"
            />
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
