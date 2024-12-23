'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, UserCircle, LogOut } from 'lucide-react';
import { auth } from '@/components/firebase/firebaseconfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const BASE_URL = 'https://ride-wise-server.vercel.app';

  // Listen to auth state changes and check registration status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.email) {
        try {
          // Check if user exists in backend and is fully registered and is passenger
          const response = await axios.get(`https://ride-wise-server.vercel.app/api/auth/user/${user.email}`);
          setIsRegistrationComplete(response.data.exists);
          console.log('Checking user registration:', response.data);
          if (response.data.exists) {
            setIsLoggedIn(true);
            setUserEmail(user.email);
            setUserType(response.data.userType || '');
            setUserName(response.data.userName || '');
            setProfilePic(user.photoURL || '');
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
    <nav className="bg-black text-white fixed w-full top-0 z-50">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">RideWise</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Other navigation links */}
            <Link href="/">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Ride</button>
            </Link>
            <Link href="/dashboard">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Drive</button>
            </Link>
            <Link href="/help">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Help</button>
            </Link>
            <Link href="/about">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">About</button>
            </Link>
            <Link href="/contact">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Contact</button>
            </Link>

            {!isLoggedIn || !isRegistrationComplete ? (
              <>
                <Link href="/auth">
                  <button className="px-3 py-2 text-white hover:text-gray-200">Log in</button>
                </Link>
                <Link href="/auth">
                  <button className="px-3 py-2 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors">
                    Sign up
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gray-200 focus:outline-none"
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircle className="h-8 w-8" />
                  )}
                </button>

                {/* Profile dropdown menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-[-60px] mt-4 w-36 rounded-md shadow-lg bg-white text-black border-gray-700 border-[2px]">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm border-b border-gray-200">
                        {userName}
                      </div>
                      <div className="px-4 py-2 text-sm border-b border-gray-200">
                        {userType.charAt(0).toUpperCase() + userType.slice(1)}
                      </div>
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black">
            {/* Mobile navigation links */}
            <Link href="/">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Ride</button>
            </Link>
            <Link href="/dashboard">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Drive</button>
            </Link>
            <Link href="/help">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Help</button>
            </Link>
            <Link href="/about">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">About</button>
            </Link>
            <Link href="/contact">
              <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Contact</button>
            </Link>

            {!isLoggedIn || !isRegistrationComplete ? (
              <>
                <Link href="/auth">
                  <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Log in</button>
                </Link>
                <Link href="/auth">
                  <button className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Sign up</button>
                </Link>
              </>
            ) : (
              <div className="space-y-1">
                <div className="px-4 py-4 text-xs text-gray-300">
                  {userName}
                </div>
                <div className="px-4 py-2 text-sm text-gray-300">
                  {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-900 rounded flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;