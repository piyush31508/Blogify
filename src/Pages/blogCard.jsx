// Blog Card Component
import { useState } from 'react';
import { ChevronLeft, Calendar, Edit, Eye, Trash2, Heart, MessageCircle, Clock, Star} from 'lucide-react';

// Enhanced Blog Card Component
const BlogCard = ({ blog, onView, onEdit, onDelete, canEdit, index }) => {
  const [isLiked, setIsLiked] = useState(false);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  const getReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">
            Article
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {getReadTime(blog.content)}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {blog.content.substring(0, 150)}...
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {blog.authorName?.charAt(0) || 'A'}
            </div>
            <div>
              <span className="font-medium text-gray-700">{blog.authorName || 'Anonymous'}</span>
              <div className="flex items-center text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(blog.createdAt)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 1 : 0}</span>
            </button>
            <span className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>0</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>0</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(blog.id)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <span>Read</span>
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
            
            {canEdit && (
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(blog.id)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(blog.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;