'use client';
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { auth } from '@/components/firebase/firebaseconfig';
import axios from 'axios';
import Link from 'next/link';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { SearchField } from '../SearchField';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Map } from '../Map';
import { TripDetails } from '../homecomp/TripDetails';
import { PendingVerification } from './PendingVerification';
import { DriverFeature } from  './DriverFeature';
import { Calendar, Clock, MapPin, CalendarPlus } from 'lucide-react';
import DriverSchedules from './DriverSchedules';

const DriverScheduleApp = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropoffSearch, setDropoffSearch] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [isLoadingPickup, setIsLoadingPickup] = useState(false);
  const [isLoadingDropoff, setIsLoadingDropoff] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('12:00');
  const [timeTo, setTimeTo] = useState('12:00');
  const [map, setMap] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropoffMarker, setDropoffMarker] = useState(null);
  const [userLocationMarker, setUserLocationMarker] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDriverAccount, setIsDriverAccount] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [driverId, setDriverId] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [driverStatus, setDriverStatus] = useState(null);
  const [isScheduleSuccess, setIsScheduleSuccess] = useState(false);
  const [scheduleSuccessMessage, setScheduleSuccessMessage] = useState('');


  const mapContainer = useRef(null);

  const BASE_URL = 'https://ride-wise-server.vercel.app';

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedPickupSearch = useDebounce(pickupSearch, 300);
  const debouncedDropoffSearch = useDebounce(dropoffSearch, 300);

  useEffect(() => {
    fetchSuggestions(debouncedPickupSearch, true);
  }, [debouncedPickupSearch]);

  useEffect(() => {
    fetchSuggestions(debouncedDropoffSearch, false);
  }, [debouncedDropoffSearch]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    if (mapContainer.current) {
      initializeMap();
    }
  }, [mapContainer]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.email) {
        try {
          const response = await axios.get(`https://ride-wise-server.vercel.app/api/auth/user/${user.email}`);
          const userData = response.data;
          
          setIsDriverAccount(userData.userType === 'driver');
          setIsLoggedIn(userData.userType === 'driver');
          setDriverStatus(userData.status);
          console.log('User data:', userData.status);
          
          if (userData.userType === 'driver') {
            setDriverId(userData.driverId);
            setDriverStatus(userData.status);
          }
        } catch (error) {
          console.error('Error checking user registration:', error);
          setIsLoggedIn(false);
          setIsDriverAccount(false);
          setDriverId(null);
          setDriverStatus(null);
        }
      } else {
        setIsLoggedIn(false);
        setIsDriverAccount(false);
        setDriverId(null);
        setDriverStatus(null);
        resetComponent();
      }
    });
  
    return () => unsubscribe();
  }, []);

  const clearRoute = () => {
    if (map) {
      if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      }
      setDistance(null);
      setDuration(null);
    }
  };

  const getRoute = async (pickup, dropoff) => {
    try {
      clearRoute();

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0]},${pickup[1]};${dropoff[0]},${dropoff[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      
      if (json.routes && json.routes[0]) {
        const data = json.routes[0];
        const route = data.geometry;
        
        const distanceInKm = (data.distance / 1000).toFixed(2);
        const durationInMinutes = Math.round(data.duration / 60);
        setDistance(distanceInKm);
        setDuration(durationInMinutes);

        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates
          }
        };

        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#000000',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });

        const coordinates = route.coordinates;
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        map.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });
      }
    } catch (error) {
      console.error('Error getting route:', error);
    }
  };

  const initializeMap = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 12,
      });

      newMap.on('load', () => {
        setMap(newMap);
      });

      const marker = new mapboxgl.Marker({ color: '#000000' })
        .setLngLat([longitude, latitude])
        .addTo(newMap);
      setUserLocationMarker(marker);
    });

    return () => {
      if (map) map.remove();
      if (userLocationMarker) userLocationMarker.remove();
      if (pickupMarker) pickupMarker.remove();
      if (dropoffMarker) dropoffMarker.remove();
    };
  };

  const handleSuggestionClick = async (suggestion, isPickup = true) => {
    const [lng, lat] = suggestion.center;
    const placeName = suggestion.place_name;

    if (isPickup) {
      setPickupLocation(placeName);
      setPickupSearch(placeName);
      setPickupSuggestions([]);
      if (pickupMarker) pickupMarker.remove();
      const newMarker = new mapboxgl.Marker({ color: '#00ff00' })
        .setLngLat([lng, lat])
        .addTo(map);
      setPickupMarker(newMarker);
    } else {
      setDropoffLocation(placeName);
      setDropoffSearch(placeName);
      setDropoffSuggestions([]);
      if (dropoffMarker) dropoffMarker.remove();
      const newMarker = new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat([lng, lat])
        .addTo(map);
      setDropoffMarker(newMarker);
    }
    
    map.flyTo({
      center: [lng, lat],
      zoom: 12,
      duration: 2000
    });

    // Draw route if both markers are present
    if ((isPickup && dropoffMarker) || (!isPickup && pickupMarker)) {
      const pickup = isPickup ? [lng, lat] : pickupMarker.getLngLat().toArray();
      const dropoff = isPickup ? dropoffMarker.getLngLat().toArray() : [lng, lat];
      
      if (pickup && dropoff) {
        await getRoute(pickup, dropoff);
      }
    }
  };

  const clearPickupLocation = () => {
    setPickupLocation('');
    setPickupSearch('');
    if (pickupMarker) {
      pickupMarker.remove();
      setPickupMarker(null);
    }
    clearRoute();
    if (!dropoffMarker) {
      initializeMap();
    }
  };

  const clearDropoffLocation = () => {
    setDropoffLocation('');
    setDropoffSearch('');
    if (dropoffMarker) {
      dropoffMarker.remove();
      setDropoffMarker(null);
    }
    clearRoute();
    if (!pickupMarker) {
      initializeMap();
    }
  };

  const fetchSuggestions = async (query, isPickup = true) => {
    if (!query.trim()) {
      isPickup ? setPickupSuggestions([]) : setDropoffSuggestions([]);
      return;
    }

    try {
      isPickup ? setIsLoadingPickup(true) : setIsLoadingDropoff(true);
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}&country=in&types=place,locality,neighborhood,address&limit=5`
      );
      const data = await response.json();
      
      if (data.features) {
        isPickup
          ? setPickupSuggestions(data.features)
          : setDropoffSuggestions(data.features);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      isPickup ? setIsLoadingPickup(false) : setIsLoadingDropoff(false);
    }
  };

  const handleAddSchedule = async () => {
    if (!isLoggedIn || !isDriverAccount) {
      setShowLoginMessage(true);
      setTimeout(() => {
        setShowLoginMessage(false);
      }, 3000);
      return;
    }

    if (pickupLocation && dropoffLocation && selectedDate && timeFrom && timeTo && driverId) {
      try {
        const scheduleData = {
          driverId,
          pickupLocation,
          dropoffLocation,
          date: selectedDate,
          timeFrom,
          timeTo,
          status: 'active'
        };

        const response = await axios.post('https://ride-wise-server.vercel.app/api/schedules', scheduleData);
        
        if (response.status === 201) {
          setIsScheduleSuccess(true);
          setScheduleSuccessMessage('Your schedule has been added successfully!');
          setSubmitStatus('Schedule added successfully!');
          resetComponent();
        } else {
          setSubmitStatus('Failed to add schedule. Please try again.');
        }
      } catch (error) {
        console.error('Error adding schedule:', error);
        setSubmitStatus(error.response?.data?.error || 'Failed to add schedule. Please try again.');
      }

      setTimeout(() => {
        setSubmitStatus('');
      }, 3000);
    } else {
      setSubmitStatus('Please fill all required fields');
      setTimeout(() => {
        setSubmitStatus('');
      }, 3000);
    }
  };

  const resetComponent = () => {
    setPickupLocation('');
    setDropoffLocation('');
    setPickupSearch('');
    setDropoffSearch('');
    setSelectedDate('');
    setTimeFrom('');
    setTimeTo('');
    if (pickupMarker) {
      pickupMarker.remove();
      setPickupMarker(null);
    }
    if (dropoffMarker) {
      dropoffMarker.remove();
      setDropoffMarker(null);
    }
    initializeMap();
  };

  const SuccessPopup = ({ message, onClose }) => {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="text-green-500">
            <i className="fas fa-check-circle text-4xl" />
          </div>
          <div className="text-green-700">
            <p className="font-semibold">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-600 hover:text-gray-800 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  

  return (
    <>
    {isDriverAccount && driverStatus === 'inactive' ? (
      <PendingVerification />
    ) : (
    <>  
     {isScheduleSuccess && (
      <SuccessPopup 
        message={scheduleSuccessMessage} 
        onClose={() => setIsScheduleSuccess(false)} 
      />
    )}
    <div className="max-w-[1500px] mx-auto mt-24 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="border-[1px] border-black bg-white p-3 w-full lg:w-[650px]">
          <div className="bg-gray-200 rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4">
              <h2 className="flex items-center text-2xl font-bold text-white">
                <CalendarPlus className="mr-2 h-6 w-6" />
                Schedule Your Route
              </h2>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Route Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                    <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                    Route Details
                  </h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <SearchField
                        icon="fa-map-marker-alt text-green-500"
                        placeholder="Pickup Location"
                        value={pickupSearch}
                        onChange={setPickupSearch}
                        suggestions={pickupSuggestions}
                        onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, true)}
                        isLoading={isLoadingPickup}
                        onClear={clearPickupLocation}
                        className="bg-white shadow-sm"
                      />
                    </div>
                    <div className="relative">
                      <SearchField
                        icon="fa-map-marker-alt text-red-500"
                        placeholder="Dropoff Location"
                        value={dropoffSearch}
                        onChange={setDropoffSearch}
                        suggestions={dropoffSuggestions}
                        onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, false)}
                        isLoading={isLoadingDropoff}
                        onClear={clearDropoffLocation}
                        className="bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Time Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                    <Clock className="mr-2 h-5 w-5 text-blue-600" />
                    Time Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available From</label>
                        <input
                          type="time"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={timeFrom}
                          onChange={(e) => setTimeFrom(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available To</label>
                        <input
                          type="time"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={timeTo}
                          onChange={(e) => setTimeTo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleAddSchedule}
                  disabled={!pickupLocation || !dropoffLocation || !selectedDate || !timeFrom || !timeTo}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="flex items-center justify-center">
                    <CalendarPlus className="mr-2 h-5 w-5" />
                    <span>Schedule Route</span>
                  </div>
                </button>

                {/* Messages */}
                {showLoginMessage && (
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-1">
                        <p className="text-amber-700 font-medium">Please log in as a driver to add schedules</p>
                        <Link 
                          href="/auth" 
                          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center mt-2"
                        >
                          Login here →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus && (
                  <div className={`rounded-lg p-4 ${
                    submitStatus.includes('successfully') 
                      ? 'bg-green-50 border-l-4 border-green-500' 
                      : 'bg-red-50 border-l-4 border-red-500'
                  }`}>
                    <p className={`${
                      submitStatus.includes('successfully') ? 'text-green-700' : 'text-red-700'
                    } font-medium`}>
                      {submitStatus}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full lg:w-[850px]">
          <div className="sticky top-8">
            <div className="bg-white shadow-xl border-[1px] border-black p-3 overflow-hidden">
              <Map mapContainer={mapContainer} className="h-[600px] w-full" />
            </div>
            {distance && duration && (
                <div className="">
                  <TripDetails distance={distance} duration={duration} />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
    <DriverSchedules driverId={driverId} />
    <DriverFeature />
    </>
    )}
    </>
  );
};

export default DriverScheduleApp;