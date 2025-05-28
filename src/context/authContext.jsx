import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

const BASE_URL = 'https://blogify-3o1l.onrender.com/api';

// Helper function to create Basic Auth header
const createAuthHeader = (email, password) => {
  const credentials = btoa(`${email}:${password}`);
  return `Basic ${credentials}`;
};

const api = {
  login: async (email, password) => {
    try {
      // First, try to get user data
      const res = await fetch(`${BASE_URL}/${email}`);
      if (!res.ok) throw new Error('User not found');
      const user = await res.json();
      
      // Store credentials for future API calls
      return { ...user, email, password };
    } catch (error) {
      throw new Error('Login failed - user not found');
    }
  },

  signup: async (name, email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/newuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password
        })
      });
      if (!res.ok) throw new Error('Registration failed');
      const user = await res.json();
      
      // Return user with credentials for future API calls
      return { ...user, email, password };
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  // Blog endpoints - Updated to include authentication
  getBlogs: async (page = 0, size = 12) => {
    try {
      const res = await fetch(`${BASE_URL}/posts`);
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();
      
      // Since your backend doesn't support pagination, we'll simulate it
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedBlogs = data.slice(startIndex, endIndex);
      
      return {
        blogs: paginatedBlogs,
        totalPages: Math.ceil(data.length / size),
        totalBlogs: data.length
      };
    } catch (error) {
      throw new Error('Failed to fetch blogs');
    }
  },

  getBlog: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/getpost/${id}`);
      if (!res.ok) throw new Error('Failed to fetch blog');
      return await res.json();
    } catch (error) {
      throw new Error('Failed to fetch blog');
    }
  },

  createBlog: async (title, content, authorId, authorName, userCredentials) => {
    try {
      if (!userCredentials || !userCredentials.email || !userCredentials.password) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${BASE_URL}/createpost`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': createAuthHeader(userCredentials.email, userCredentials.password)
        },
        body: JSON.stringify({
          title,
          content,
          authorId,
          authorName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error('Failed to create blog');
      }
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  updateBlog: async (id, title, content, userCredentials) => {
    try {
      if (!userCredentials || !userCredentials.email || !userCredentials.password) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${BASE_URL}/post/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': createAuthHeader(userCredentials.email, userCredentials.password)
        },
        body: JSON.stringify({ 
          title, 
          content,
          updatedAt: new Date().toISOString()
        })
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error('Failed to update blog');
      }
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  deleteBlog: async (id, userCredentials) => {
    try {
      if (!userCredentials || !userCredentials.email || !userCredentials.password) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${BASE_URL}/deletepost/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': createAuthHeader(userCredentials.email, userCredentials.password)
        }
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        if (res.status === 403) {
          throw new Error('You can only delete your own posts.');
        }
        throw new Error('Failed to delete blog');
      }
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In Claude artifacts, localStorage doesn't work, but keeping for reference
    // In your actual app, this will work fine
    try {
      const storedUser = typeof localStorage !== 'undefined' ? 
        JSON.parse(localStorage.getItem('user') || 'null') : null;
      setUser(storedUser);
    } catch (error) {
      console.error('Error loading user from storage:', error);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await api.login(email, password);
      setUser(userData);
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const userData = await api.signup(name, email, password);
      setUser(userData);
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  };

  // Enhanced API object that includes user credentials
  const enhancedApi = {
    ...api,
    createBlog: (title, content, authorId, authorName) => 
      api.createBlog(title, content, authorId, authorName, user),
    updateBlog: (id, title, content) => 
      api.updateBlog(id, title, content, user),
    deleteBlog: (id) => 
      api.deleteBlog(id, user)
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      loading, 
      api: enhancedApi 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };