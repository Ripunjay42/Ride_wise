//Dashboard.js
import React from 'react';
import TopBar from '@/components/Topbar';

const Dashboard = () => {
  return (
    <>
        <TopBar />
        <div className="bg-gray-100 py-12 px-4 mt-16 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center mb-4">Welcome to the Dashboard</h2>
            {/* <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 "> Logout </button> */}
        </div>
    </>
  );
};

export default Dashboard;
