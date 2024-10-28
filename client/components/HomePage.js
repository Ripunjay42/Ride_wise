import React, { useState } from 'react';
import { FaCar, FaBox, FaLocationArrow, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 26.1445, // Latitude for Guwahati (example)
  lng: 91.7362, // Longitude for Guwahati (example)
};

const HomePage = () => {
  const [selectedOption, setSelectedOption] = useState('Ride');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Go anywhere with Uber</h1>
      <div className="flex items-center space-x-4 mb-6">
        {/* Toggle between Ride and Package */}
        <button
          onClick={() => setSelectedOption('Ride')}
          className={`px-4 py-2 ${selectedOption === 'Ride' ? 'bg-black text-white' : 'bg-gray-200 text-black'} rounded-full flex items-center space-x-2`}
        >
          <FaCar />
          <span>Ride</span>
        </button>
        <button
          onClick={() => setSelectedOption('Package')}
          className={`px-4 py-2 ${selectedOption === 'Package' ? 'bg-black text-white' : 'bg-gray-200 text-black'} rounded-full flex items-center space-x-2`}
        >
          <FaBox />
          <span>Package</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
        {/* Form Section */}
        <div className="form bg-gray-100 p-4 rounded-lg md:w-1/2">
          <div className="mb-4">
            <label className="text-gray-700">Pickup location</label>
            <div className="flex items-center bg-white px-3 py-2 rounded">
              <FaLocationArrow className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Pickup location"
                className="flex-1 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-700">Dropoff location</label>
            <div className="flex items-center bg-white px-3 py-2 rounded">
              <FaLocationArrow className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Dropoff location"
                className="flex-1 focus:outline-none"
              />
            </div>
          </div>

          {/* Only show date and time for "Ride" option */}
          {selectedOption === 'Ride' && (
            <>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label className="text-gray-700">Date</label>
                  <div className="flex items-center bg-white px-3 py-2 rounded">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Today"
                      className="flex-1 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-gray-700">Time</label>
                  <div className="flex items-center bg-white px-3 py-2 rounded">
                    <FaClock className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Now"
                      className="flex-1 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <button className="w-full bg-black text-white py-2 rounded">
            See prices
          </button>
        </div>

        {/* Google Maps Section */}
        <div className="md:w-1/2 h-80">
          <LoadScript googleMapsApiKey="AIzaSyC-dkCr8t0GA2spbBCPQyfxS6P5xtdSzdM">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
            >
              {/* Marker Example */}
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
