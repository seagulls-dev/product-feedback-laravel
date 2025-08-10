import React, { useState, useRef } from 'react';
import { Bold, Italic, Code, Link, AtSign, Send, X } from 'lucide-react';
import { User } from '../../types';
import { commentsAPI } from '../../services/api';

interface CommentEditorProps {
  feedbackId: number;
  parentId?: number;
  onSubmit: (comment: any) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
}

const CommentEditor: React.FC<CommentEditorProps> = ({
  feedbackId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  submitLabel = "Post Comment"
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionUsers, setMentionUsers] = useState<User[]>([]);
  const [mentionPosition, setMentionPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await commentsAPI.create({
        content: content.trim(),
        feedback_id: feedbackId,
        parent_id: parentId,
      });
      onSubmit(response.comment);
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertFormatting = (start: string, end: string = start) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = content.substring(startPos, endPos);
    
    const newContent = 
      content.substring(0, startPos) +
      start +
      selectedText +
      end +
      content.substring(endPos);
    
    setContent(newContent);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = startPos + start.length + selectedText.length + end.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleTextareaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    // Check for mentions
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      setMentionPosition(cursorPos - query.length - 1);
      setShowMentions(true);

      if (query.length >= 2) {
        try {
          const users = await commentsAPI.searchUsers(query);
          setMentionUsers(users);
        } catch (error) {
          console.error('Error searching users:', error);
        }
      } else {
        setMentionUsers([]);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user: User) => {
    const beforeMention = content.substring(0, mentionPosition);
    const afterMention = content.substring(mentionPosition + mentionQuery.length + 1);
    const newContent = beforeMention + '@' + user.name + ' ' + afterMention;
    
    setContent(newContent);
    setShowMentions(false);
    
    // Focus textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Formatting Toolbar */}
      <div className="flex items-center space-x-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => insertFormatting('**')}
          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('*')}
          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('`')}
          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('[', '](url)')}
          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
          title="Link"
        >
          <Link className="h-4 w-4" />
        </button>
        <div className="border-l border-gray-300 h-4 mx-1" />
        <button
          type="button"
          onClick={() => insertFormatting('@')}
          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
          title="Mention User"
        >
          <AtSign className="h-4 w-4" />
        </button>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          rows={4}
          className="w-full p-3 border-0 resize-none focus:outline-none focus:ring-0"
        />

        {/* Mentions Dropdown */}
        {showMentions && mentionUsers.length > 0 && (
          <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg">
            {mentionUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none first:rounded-t-md last:rounded-b-md"
              >
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center p-3 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Supports <strong>**bold**</strong>, <em>*italic*</em>, <code>`code`</code>, and @mentions
        </div>
        <div className="flex space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
            ) : (
              <Send className="h-3 w-3 mr-1" />
            )}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentEditor;
