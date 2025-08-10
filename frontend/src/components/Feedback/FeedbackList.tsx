import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Feedback, FeedbackCategory, FeedbackFilters, PaginatedResponse } from '../../types';
import { feedbackAPI, categoriesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import FeedbackCard from './FeedbackCard';

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [categories, setCategories] = useState<FeedbackCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Feedback>, 'data'> | null>(null);
  const [filters, setFilters] = useState<FeedbackFilters>({
    per_page: 15,
    page: 1,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { isAuthenticated } = useAuth();

  const loadFeedbacks = useCallback(async (newFilters?: FeedbackFilters) => {
    try {
      setLoading(true);
      const filtersToUse = newFilters || filters;
      const response = await feedbackAPI.list(filtersToUse);
      setFeedbacks(response.data);
      setPagination({
        current_page: response.current_page,
        from: response.from,
        last_page: response.last_page,
        per_page: response.per_page,
        to: response.to,
        total: response.total,
        links: response.links,
      });
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.list();
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadFeedbacks();
  }, [filters, loadFeedbacks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = {
      ...filters,
      search: searchTerm || undefined,
      page: 1,
    };
    setFilters(newFilters);
  };

  const handleFilterChange = (key: keyof FeedbackFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
      page: 1,
    };
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
  };

  const handleVote = (feedbackId: number, votes: { upvotes: number; downvotes: number; net_score: number }) => {
    setFeedbacks(prev =>
      prev.map(feedback =>
        feedback.id === feedbackId ? { ...feedback, ...votes } : feedback
      )
    );
  };

  const clearFilters = () => {
    setFilters({ per_page: 15, page: 1 });
    setSearchTerm('');
  };

  if (loading && feedbacks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Feedback</h1>
          <p className="mt-1 text-sm text-gray-600">
            Share your ideas and help us improve our products
          </p>
        </div>
        {isAuthenticated && (
          <Link
            to="/feedback/create"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Submit Feedback
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search feedback..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Search
            </button>
          </div>
        </form>

        {isFilterOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category_id || ''}
                  onChange={(e) => handleFilterChange('category_id', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {pagination && (
        <div className="text-sm text-gray-600">
          Showing {pagination.from}-{pagination.to} of {pagination.total} feedback items
        </div>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {filters.search || filters.category_id || filters.status
                ? 'No feedback found matching your criteria.'
                : 'No feedback has been submitted yet.'}
            </div>
            {isAuthenticated && (
              <Link
                to="/feedback/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Be the first to submit feedback
              </Link>
            )}
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onVote={handleVote}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
