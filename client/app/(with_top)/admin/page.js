'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { UserCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Admindashboard from '@/components/Admindashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';


const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [formData, setFormData] = useState({
    admin_name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = 'https://ride-wise-server.vercel.app';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('https://ride-wise-server.vercel.app/api/auth/admin/login', formData);
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
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-200">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border-[1px] border-black transform transition-all hover:shadow-2xl hover:scale-105">
                <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
                <p className="text-gray-500">Please enter your credentials</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="relative">
                    <i className="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                    <input
                    type="text"
                    name="admin_name"
                    placeholder="Admin Name"
                    value={formData.admin_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-gray-700 placeholder-gray-400"
                    disabled={isLoading}
                    required
                    />
                </div>
                <div className="relative">
                    <i className="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-gray-700 placeholder-gray-400"
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
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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