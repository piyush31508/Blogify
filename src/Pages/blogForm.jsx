// Create/Edit Blog Component
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/authContext';

const BlogForm = ({ setCurrentPage, blogId, isEdit = false }) => {
  const { api, user } = useAuth();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && blogId) {
      loadBlog();
    }
  }, [isEdit, blogId]);

  const loadBlog = async () => {
    try {
      const blog = await api.getBlog(blogId);
      setFormData({ title: blog.title, content: blog.content });
    } catch (error) {
      console.error('Error loading blog:', error);
      setError('Failed to load blog');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setError('Please login to create or edit posts');
      return;
    }

    // Check if user credentials are available
    if (!user.email || !user.password) {
      setError('Authentication credentials missing. Please login again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await api.updateBlog(blogId, formData.title, formData.content);
      } else {
        await api.createBlog(formData.title, formData.content, user.id, user.name);
      }
      setCurrentPage('home');
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'An error occurred while saving the post');
      
      // If authentication failed, suggest re-login
      if (err.message.includes('Authentication failed')) {
        setError('Authentication failed. Please logout and login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show message if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Please Login
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to create or edit posts.
            </p>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8 group transition-all"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {isEdit ? 'Edit Your Story' : 'Share Your Story'}
            </h1>
            <p className="text-blue-100 mt-2">
              {isEdit ? 'Update your thoughts and ideas' : 'Write something amazing for the world to read'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
                Article Title
              </label>
              <input
                type="text"
                id="title"
                required
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                placeholder="Enter an engaging title..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-3">
                Content
              </label>
              <textarea
                id="content"
                required
                rows={16}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell your story..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
              <div className="mt-2 text-sm text-gray-500">
                {formData.content.length} characters
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Publishing...' : (isEdit ? 'Update Article' : 'Publish Article')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;