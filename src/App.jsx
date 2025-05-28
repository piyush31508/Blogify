import React, { useState } from 'react';
import { useAuth } from './context/authContext';
import Header from './Pages/header';
import Home from './Pages/home';
import Auth from './Auth/auth';
import BlogDetail from './Pages/blogDetails';
import BlogForm from './Pages/blogForm';
import Loading from './Components/Utility/loading';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [blogId, setBlogId] = useState(null);
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <Auth setCurrentPage={setCurrentPage} />;
      case 'home':
        return <Home setCurrentPage={setCurrentPage} setBlogId={setBlogId} />;
      case 'detail':
        return <BlogDetail blogId={blogId} setCurrentPage={setCurrentPage} />;
      case 'create':
        return user ? (
          <BlogForm setCurrentPage={setCurrentPage} />
        ) : (
          <Auth setCurrentPage={setCurrentPage} />
        );
      case 'edit':
        return user ? (
          <BlogForm setCurrentPage={setCurrentPage} blogId={blogId} isEdit={true} />
        ) : (
          <Auth setCurrentPage={setCurrentPage} />
        );
      default:
        return <Home setCurrentPage={setCurrentPage} setBlogId={setBlogId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'auth' && (
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {renderPage()}
    </div>
  );
};

export default App;
