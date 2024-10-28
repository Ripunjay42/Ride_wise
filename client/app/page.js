'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import BookingComponent  from '@/components/home/BookingComponent';

const page = () => {
  return (
    <>
      <Navbar />
      <BookingComponent />
    </>
  );
};

export default page;
