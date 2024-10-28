import React from 'react';
import Link from 'next/link';

const TopBar = () => {
  return (
    <div className="bg-black text-white fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
 
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold">Ridewise</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopBar;
