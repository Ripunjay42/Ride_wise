// components/BookingComponent.jsx
'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';

// Dynamically import MapContainer and components from react-leaflet
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
import 'leaflet/dist/leaflet.css';

const vehicleTypes = [
  { id: 1, name: 'Standard', basePrice: 5, pricePerKm: 1.5, image: '/api/placeholder/60/60' },
  { id: 2, name: 'Premium', basePrice: 8, pricePerKm: 2.2, image: '/api/placeholder/60/60' },
  { id: 3, name: 'Van', basePrice: 10, pricePerKm: 2.5, image: '/api/placeholder/60/60' }
];

const center = [51.5074, -0.1278];

const BookingComponent = () => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const handleCalculateRoute = () => {
    if (!pickup || !destination) return;
    // Here you might implement the logic to calculate the distance
    // For now, we'll just simulate a distance calculation
    setDistance(5); // Simulated distance
  };

  const calculatePrice = (vehicleType) => {
    if (!distance) return null;
    return (vehicleType.basePrice + distance * vehicleType.pricePerKm).toFixed(2);
  };

  useEffect(() => {
    // Set map ready to true once the component is mounted
    setIsMapReady(true);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto px-4 pt-20">
      {/* Left Side - Booking Form */}
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Book a Ride</h2>
        
        {/* Location Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter pickup latitude,longitude (e.g., 51.5074,-0.1278)"
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(',').map(Number);
                setPickup({ lat, lng });
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter destination latitude,longitude (e.g., 51.509, -0.118)"
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(',').map(Number);
                setDestination({ lat, lng });
              }}
            />
          </div>
        </div>

        {/* Vehicle Selection */}
        {distance && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Select Vehicle Type</h3>
            <div className="space-y-3">
              {vehicleTypes.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedVehicle?.id === vehicle.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-12 h-12 rounded-md"
                      />
                      <div>
                        <h4 className="font-medium">{vehicle.name}</h4>
                        <p className="text-sm text-gray-500">
                          ${calculatePrice(vehicle)} estimated
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Button */}
        {selectedVehicle && (
          <button
            className="w-full mt-6 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            onClick={handleCalculateRoute}
          >
            Book {selectedVehicle.name} - ${calculatePrice(selectedVehicle)}
          </button>
        )}
      </div>

      {/* Right Side - Map */}
      <div className="w-full md:w-2/3 h-[600px] rounded-lg overflow-hidden shadow-lg">
        {isMapReady && (
          <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
            {destination && <Marker position={[destination.lat, destination.lng]} />}
            {/* Add RoutingMachine component here if needed */}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default BookingComponent;
