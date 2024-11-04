'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { UserCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Admindashboard from '@/components/Admindashboard';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [formData, setFormData] = useState({
    admin_name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/admin/login', formData);
      if (response.data.success) {
        setIsLoggedIn(true);
        setAdminName(response.data.admin.admin_name);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminName('');
    setFormData({ admin_name: '', password: '' });
  };

  if (!isLoggedIn) {
    return (
        <>
        <Navbar />
      <div className="min-h-screen flex justify-center bg-gray-50 mt-32">
        <div className="w-full h-full max-w-md p-6 bg-white rounded-lg shadow-lg border-2 border-black">
          <div className="space-y-1 mb-6">
            <h2 className="text-2xl font-bold text-center">Admin Login</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                name="admin_name"
                placeholder="Admin Name"
                value={formData.admin_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      </>
    );
  }

  return (
    <Admindashboard adminName={adminName} onLogout={handleLogout} />
  );
};

export default AdminPanel;