'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle, CheckCircle, XCircle } from 'lucide-react';

// Dashboard Tabs Component
const DashboardTabs = ({ activeTab, setActiveTab }) => (
  <div className="mb-6 border-b border-gray-200">
    <div className="flex space-x-8">
      <button
        className={`py-4 px-1 border-b-2 font-medium text-sm ${
          activeTab === 'drivers'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
        onClick={() => setActiveTab('drivers')}
      >
        Drivers
      </button>
      <button
        className={`py-4 px-1 border-b-2 font-medium text-sm ${
          activeTab === 'passengers'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
        onClick={() => setActiveTab('passengers')}
      >
        Passengers
      </button>
    </div>
  </div>
);

// Drivers Table Component
const DriversTable = ({ drivers, handleVerifyDriver, isLoading }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Info</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {drivers.map((driver) => (
          <tr key={driver.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {driver.firstName} {driver.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{driver.gender}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {driver.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {driver.phoneNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{driver.vehicleNumber}</div>
              <div className="text-sm text-gray-500">{driver.vehicleType}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {driver.licenseNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {driver.status === 'active' ? (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Verified
                </span>
              ) : (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {driver.status === 'inactive' ? (
                <button
                  onClick={() => handleVerifyDriver(driver.id)}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify
                </button>
              ) : (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Passengers Table Component
const PassengersTable = ({ passengers }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {passengers.map((passenger) => (
          <tr key={passenger.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {passenger.firstName} {passenger.lastName}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {passenger.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {passenger.phoneNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {passenger.gender}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {passenger.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Dashboard Component
const Admindashboard = ({ adminName, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('drivers');
  const [drivers, setDrivers] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = 'https://ride-wise-server.vercel.app';

  // Fetch drivers and passengers data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, passengersRes] = await Promise.all([
          axios.get('https://ride-wise-server.vercel.app/api/drivers'),
          axios.get('https://ride-wise-server.vercel.app/api/passengers')
        ]);
        setDrivers(driversRes.data);
        setPassengers(passengersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleVerifyDriver = async (driverId) => {
    if (window.confirm('Are you sure you want to verify this driver?')) {
      setIsLoading(true);
      try {
        await axios.patch(`https://ride-wise-server.vercel.app/api/drivers/${driverId}/verify`, {
          status: 'active'
        });
        
        // Update the drivers list
        setDrivers(drivers.map(driver => 
          driver.id === driverId 
            ? { ...driver, status: 'active' }
            : driver
        ));
      } catch (error) {
        console.error('Error verifying driver:', error);
        alert('Failed to verify driver. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {adminName}</span>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="inline-flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Profile Menu"
                >
                  <UserCircle className="h-8 w-8" />
                </button>
                {showDropdown && (
                  <div className="absolute right-[-25px] mt-0 w-24 rounded-md shadow-lg bg-white text-black border-gray-700 border-[2px]">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onLogout();
                      }}
                      className="block w-full text-center px-4 py-2 text-sm font-extrabold text-black"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="bg-white shadow rounded-lg">
            {activeTab === 'drivers' ? (
              <DriversTable 
                drivers={drivers} 
                handleVerifyDriver={handleVerifyDriver}
                isLoading={isLoading}
              />
            ) : (
              <PassengersTable passengers={passengers} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admindashboard;
