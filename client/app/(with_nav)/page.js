//homepage.js
'use client';
import React from 'react';
import BookingApp  from '@/components/homecomp/BookingApp';
import FeaturesSection from '@/components/homecomp/FeatureSection';

const page = () => {
  return (
    <>
      <BookingApp />
      <FeaturesSection />
    </>
  );
};

export default page;
