import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Send } from 'lucide-react';
import { FeedbackCategory } from '../../types';
import { feedbackAPI, categoriesAPI } from '../../services/api';

const schema = yup.object({
  title: yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  feedback_category_id: yup.number().required('Please select a category'),
});

type FormData = yup.InferType<typeof schema>;

const FeedbackForm: React.FC = () => {
  const [categories, setCategories] = useState<FeedbackCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchTitle = watch('title', '');
  const watchDescription = watch('description', '');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.list();
        setCategories(response);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await feedbackAPI.create(data);
      navigate(`/feedback/${response.feedback.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Submit Feedback</h1>
        <p className="mt-1 text-gray-600">
          Help us improve by sharing your thoughts, ideas, or reporting issues.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                {...register('title')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brief, descriptive title for your feedback"
              />
              <div className="mt-1 flex justify-between">
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {watchTitle.length}/255
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="feedback_category_id" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                {...register('feedback_category_id')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.feedback_category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.feedback_category_id.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={8}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Provide detailed information about your feedback. What would you like to see improved? What issues are you experiencing? Be as specific as possible."
              />
              <div className="mt-1 flex justify-between">
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {watchDescription.length} characters
                </p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Guidelines for effective feedback:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be specific and clear about the issue or suggestion</li>
                <li>• Include steps to reproduce if reporting a bug</li>
                <li>• Describe the expected vs actual behavior</li>
                <li>• Provide context about your use case</li>
                <li>• Be respectful and constructive</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
