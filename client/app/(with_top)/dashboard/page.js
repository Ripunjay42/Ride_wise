//Dashboard.js
import React from 'react';
import Navbar from '@/components/Navbar';
import DriverScheduleApp from '@/components/homecomp/DriverScheduleApp';

const Dashboard = () => {
  return (
    <>
        <Navbar />
        <DriverScheduleApp />
    </>
  );
};

export default Dashboard;
