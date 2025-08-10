export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackCategory {
  id: number;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  upvotes: number;
  downvotes: number;
  net_score: number;
  user_id: number;
  feedback_category_id: number;
  user: User;
  category: FeedbackCategory;
  comments?: FeedbackComment[];
  topLevelComments?: FeedbackComment[];
  created_at: string;
  updated_at: string;
}

export interface FeedbackComment {
  id: number;
  content: string;
  content_html: string;
  user_id: number;
  feedback_id: number;
  parent_id?: number;
  mentioned_users?: number[];
  user: User;
  feedback?: Feedback;
  parent?: FeedbackComment;
  replies?: FeedbackComment[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface FeedbackFilters {
  category_id?: number;
  status?: string;
  search?: string;
  per_page?: number;
  page?: number;
}
