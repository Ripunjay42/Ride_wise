//homepage.js
'use client';
import React from 'react';
import BookingComponent  from '@/components/home/BookingComponent';
import FeaturesSection from '@/components/home/FeatureSection';

const page = () => {
  return (
    <>
      <BookingComponent />
      <FeaturesSection />
    </>
  );
};

export default page;
