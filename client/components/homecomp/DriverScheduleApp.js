'use client';
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { auth } from '@/components/firebase/firebaseconfig';
import axios from 'axios';
import Link from 'next/link';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { SearchField } from './SearchField';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Map } from './Map';
import { TripDetails } from './TripDetails';
import { PendingVerification } from './PendingVerification';
import { DriverFeature } from  './DriverFeature';

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

  const mapContainer = useRef(null);

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
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3BpZGVybmlzaGFudGEiLCJhIjoiY20ydW5ubGZuMDNlZTJpc2I1N2o3YWo0aiJ9.tKmf9gr1qgyi_N7WOaPoZw';

    if (mapContainer.current) {
      initializeMap();
    }
  }, [mapContainer]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.email) {
        try {
          const response = await axios.get(`http://localhost:3001/api/auth/user/${user.email}`);
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

        const response = await axios.post('http://localhost:3001/api/schedules', scheduleData);
        
        if (response.status === 201) {
          setSubmitStatus('Schedule added successfully!');
          resetComponent();
        } else {
          setSubmitStatus('Failed to add schedule. Please try again.');
        }
      } catch (error) {
        console.error('Error adding schedule:', error);
        setSubmitStatus('Error adding schedule. Please try again.');
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

  return (
    <>
    {isDriverAccount && driverStatus === 'inactive' ? (
      <PendingVerification />
    ) : (
    <>  
    <div className="max-w-7xl mx-auto mt-20">
      <div className="flex flex-col md:flex-row gap-8 my-8">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>ADD SCHEDULE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-4">
                    <label className="font-semibold text-lg">
                      <i className="fas fa-map-marker-alt mr-3 text-black text-3xl"></i>
                      Set Route
                    </label>
                  </div>
                  <div className="space-y-2">
                  <SearchField
                      icon="fa-map-marker-alt text-green-500"
                      placeholder="Enter pickup location"
                      value={pickupSearch}
                      onChange={setPickupSearch}
                      suggestions={pickupSuggestions}
                      onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, true)}
                      isLoading={isLoadingPickup}
                      onClear={clearPickupLocation}
                    />
                    <SearchField
                      icon="fa-map-marker-alt text-red-500"
                      placeholder="Enter dropoff location"
                      value={dropoffSearch}
                      onChange={setDropoffSearch}
                      suggestions={dropoffSuggestions}
                      onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, false)}
                      isLoading={isLoadingDropoff}
                      onClear={clearDropoffLocation}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                  <label className="block font-medium mb-1">Select Date</label>
                  <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                    <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>
                    <input
                      type="date"
                      className="w-full border-none focus:outline-none"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Available From</label>
                      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                        <i className="fas fa-clock mr-2 text-orange-500"></i>
                        <input
                          type="time"
                          className="w-full border-none focus:outline-none"
                          value={timeFrom}
                          onChange={(e) => setTimeFrom(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Available To</label>
                      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                        <i className="fas fa-clock mr-2 text-orange-500"></i>
                        <input
                          type="time"
                          className="w-full border-none focus:outline-none"
                          value={timeTo}
                          onChange={(e) => setTimeTo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddSchedule}
                  className="w-full group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  disabled={!pickupLocation || !dropoffLocation || !selectedDate || !timeFrom || !timeTo}
                >
                  <div className="absolute inset-0 w-3 bg-gradient-to-r from-white to-transparent opacity-10 transform -skew-x-12 group-hover:animate-shine"></div>
                  <i className="fas fa-calendar-plus mr-2 group-hover:animate-wiggle"></i>
                  <span className="tracking-wide">Add Schedule</span>
                </button>

                {showLoginMessage && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-red-600 mb-2">
                      Please log in as a driver to add schedules.
                    </p>
                    <Link 
                      href="/auth" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Login here
                    </Link>
                  </div>
                )}

                {submitStatus && (
                  <div className={`mt-4 p-4 ${
                    submitStatus.includes('successfully') 
                      ? 'bg-green-50 border border-green-300' 
                      : 'bg-red-50 border border-red-300'
                  } rounded-md`}>
                    <p className={submitStatus.includes('successfully') ? 'text-green-500 text-2xl' : 'text-red-600 text-2xl'}>
                      {submitStatus}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 mt-8">
          <Map mapContainer={mapContainer} />
          {distance && duration && <TripDetails distance={distance} duration={duration} />}
        </div>
      </div>
    </div>
    <DriverFeature />
    </>
    )}
    </>
  );
};

export default DriverScheduleApp;