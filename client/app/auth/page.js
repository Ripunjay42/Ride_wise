'use client';
import React, { useState, useEffect } from 'react';
import { auth, provider } from '@/components/firebase/firebaseconfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import axios from 'axios';
import TopBar from '@/components/Topbar';
import { useRouter } from 'next/navigation';

const AuthFlow = () => {
  const router = useRouter();
  const [googleSignInComplete, setGoogleSignInComplete] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userType, setUserType] = useState('passenger');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleType: '',
  });

  // Cleanup function to sign out if user leaves after Google sign-in but before registration
  useEffect(() => {
    return () => {
      if (auth.currentUser && googleSignInComplete && !registrationComplete) {
        signOut(auth).then(() => {
          console.log('User signed out due to incomplete registration');
        }).catch((error) => {
          console.error('Error signing out:', error);
        });
      }
    };
  }, [googleSignInComplete, registrationComplete]);

  // Handle Google login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in the backend
      const response = await axios.get(`http://localhost:3001/api/auth/user/${user.email}`);

      // If user exists, route based on user type
      if (response.data.exists) {
        console.log('User exists:', response.data);
        setRegistrationComplete(true);
        if (response.data.userType === 'driver') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        // User does not exist, set form data and mark Google sign-in as complete
        setFormData({
          ...formData,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
        });
        setGoogleSignInComplete(true);
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      // If there's an error, make sure to sign out
      await signOut(auth);
      setGoogleSignInComplete(false);
    }
  };

  // Handle manual sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setGoogleSignInComplete(false);
      setRegistrationComplete(false);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        licenseNumber: '',
        vehicleNumber: '',
        vehicleType: '',
      });
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3001/api/auth/signup`, {
        ...formData,
        userType,
      });
      console.log('User registered:', response.data);
      setRegistrationComplete(true);

      // Route based on user type after successful registration
      if (userType === 'driver') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      // If registration fails, sign out the user
      await handleSignOut();
    }
  };

  // Update form data state
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div>
      <TopBar />
      <div className="min-h-screen bg-gray-100 py-12 px-4 mt-16">
        <div className="max-w-md mx-auto bg-white rounded shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            {!googleSignInComplete ? 'Welcome to RideWise' : 'Complete Your Profile'}
          </h2>

          {!googleSignInComplete ? (
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
                  disabled
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

              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-green-500 text-white rounded px-4 py-2 hover:bg-green-400">
                  Complete Registration
                </button>
                <button 
                  type="button" 
                  onClick={handleSignOut}
                  className="flex-1 bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;