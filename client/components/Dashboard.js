import React from 'react';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 mt-16">
      <h2 className="text-3xl font-bold text-center mb-4">Welcome to the Dashboard</h2>
      <button
        onClick={onLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
      >
        Logout
      </button>
      {/* Additional dashboard content goes here */}
    </div>
  );
};

export default Dashboard;
