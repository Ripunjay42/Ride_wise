'use client';
import React, { useState } from 'react';
import { auth, provider } from '@/components/firebase/firebaseconfig'; // Adjust import path if necessary
import { signInWithPopup, signOut } from 'firebase/auth';
import axios from 'axios';
import TopBar from '@/components/Topbar'; // Adjust import path as needed
import Dashboard from '@/components/Dashboard'; // Import the Dashboard component

const AuthFlow = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userType, setUserType] = useState('passenger'); // Default user type
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleType: '',
  });
  const [isDashboard, setIsDashboard] = useState(false); // New state to render the dashboard

  // Handle Google login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in the backend
      const response = await axios.get(`http://localhost:3001/api/auth/user/${user.email}`);

      // If user exists, go directly to the dashboard
      if (response.data.exists) {
        console.log('User exists:', response.data);
        setIsDashboard(true);
        setIsRegistered(false);
      } else {
        // User does not exist, set form data
        setFormData({
          ...formData,
          email: user.email,
          firstName: user.displayName.split(' ')[0], // Assuming name format "First Last"
          lastName: user.displayName.split(' ')[1], // Assuming name format "First Last"
        });
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3001/api/auth/signup`, {
        ...formData,
        userType, // Send user type to the backend
      });
      console.log('User registered:', response.data);

      // Navigate to Dashboard after successful registration
      setIsDashboard(true);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // Update form data state
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      setIsDashboard(false); // Reset to show AuthFlow
      setIsRegistered(false); // Reset registration state
      setFormData({ // Clear form data
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        licenseNumber: '',
        vehicleNumber: '',
        vehicleType: '',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Render the Dashboard if the user is logged in and registered
  if (isDashboard) {
    return (
      <div>
        <TopBar />
        <Dashboard onLogout={handleLogout} /> {/* Pass logout function to Dashboard */}
      </div>
    );
  }

  return (
    <div>
      <TopBar />
      <div className="min-h-screen bg-gray-100 py-12 px-4 mt-16">
        <div className="max-w-md mx-auto bg-white rounded shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            {!isRegistered ? 'Welcome to RideWise' : 'Complete Your Profile'}
          </h2>

          {!isRegistered ? (
            <div className="space-y-4">
              <button 
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Sign up with Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-1">Account Type</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="passenger"
                      checked={userType === 'passenger'}
                      onChange={() => setUserType('passenger')}
                      className="mr-2"
                    />
                    Passenger
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="driver"
                      checked={userType === 'driver'}
                      onChange={() => setUserType('driver')}
                      className="mr-2"
                    />
                    Driver
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                <input 
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  disabled // Disable email field since it comes from Google
                />
              </div>

              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-1">First Name</label>
                <input 
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-1">Last Name</label>
                <input 
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 mb-1">Phone Number</label>
                <input 
                  id="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>

              {/* Additional fields for Drivers */}
              {userType === 'driver' && (
                <>
                  <div>
                    <label htmlFor="licenseNumber" className="block text-gray-700 mb-1">License Number</label>
                    <input 
                      id="licenseNumber"
                      required
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicleNumber" className="block text-gray-700 mb-1">Vehicle Number</label>
                    <input 
                      id="vehicleNumber"
                      required
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicleType" className="block text-gray-700 mb-1">Vehicle Type</label>
                    <input 
                      id="vehicleType"
                      required
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>
                </>
              )}

              <button type="submit" className="w-full bg-green-500 text-white rounded px-4 py-2 hover:bg-green-400">
                Complete Registration
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;
