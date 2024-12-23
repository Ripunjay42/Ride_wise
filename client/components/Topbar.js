'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCircle, LogOut } from 'lucide-react';
import { auth } from '@/components/firebase/firebaseconfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const TopBar = () => {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userType, setUserType] = useState('');
  const BASE_URL = 'https://ride-wise-server.vercel.app';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.email) {
        try {
          const response = await axios.get(`https://ride-wise-server.vercel.app/api/auth/user/${user.email}`);
          setIsRegistrationComplete(response.data.userType === 'driver');
          if (response.data.userType === 'driver') {
            setIsLoggedIn(true);
            setUserEmail(user.email);
            setUserType(response.data.userType || '');
          } else {
            setIsLoggedIn(false);
            setUserEmail('');
            setUserType('');
          }
        } catch (error) {
          console.error('Error checking user registration:', error);
          setIsLoggedIn(false);
          setIsRegistrationComplete(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsRegistrationComplete(false);
        setUserEmail('');
        setUserType('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsRegistrationComplete(false);
      setIsLoggedIn(false);
      setUserEmail('');
      setUserType('');
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="bg-black text-white fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">Ridewise</span>
            </Link>
          </div>

          {/* Profile Section */}
          {isLoggedIn && isRegistrationComplete && (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-white hover:text-gray-200 focus:outline-none"
              >
                <UserCircle className="h-8 w-8" />
              </button>

              {/* Profile dropdown menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-4 w-28 rounded-md shadow-lg bg-white text-black border-gray-700 border-[2px]">
                  <div className="py-1">
                    {/* <div className="px-4 py-2 text-sm border-b border-gray-200">
                      {userEmail}
                    </div>
                    <div className="px-4 py-2 text-sm border-b border-gray-200">
                      {userType.charAt(0).toUpperCase() + userType.slice(1)}
                    </div> */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 font-extrabold text-black"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;