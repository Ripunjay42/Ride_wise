//homepage.js
'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import BookingComponent  from '@/components/home/BookingComponent';
import FeaturesSection from '@/components/home/FeatureSection';

const page = () => {
  return (
    <>
      <Navbar />
      <BookingComponent />
      <FeaturesSection />
    </>
  );
};

export default page;
