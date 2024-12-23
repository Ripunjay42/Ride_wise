'use client';
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { auth } from '@/components/firebase/firebaseconfig';
import axios from 'axios';
import Link from 'next/link';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {SearchField} from '../SearchField';
import {Card, CardContent, CardHeader, CardTitle} from '../Card';
import { DateTimeSelector } from './DateTimeSelector';
import { VehicleList } from './VehicleList';
import { TripDetails } from './TripDetails';
import { Map } from '../Map';
import  BookingStatusPanel  from './BookingStatusPanel';
import { MapPin, Clock, Tag, CheckCircle, Calendar, Navigation } from 'lucide-react';


const BookingApp = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropoffSearch, setDropoffSearch] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [isLoadingPickup, setIsLoadingPickup] = useState(false);
  const [isLoadingDropoff, setIsLoadingDropoff] = useState(false);
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [showPrices, setShowPrices] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [map, setMap] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropoffMarker, setDropoffMarker] = useState(null);
  const [userLocationMarker, setUserLocationMarker] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [allfields, setAllfields] = useState(false);
  const [allfmsg, setAllfmsg] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noVehiclesMessage, setNoVehiclesMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [passengerId, setPassengerId] = useState('');
  const [isStatusPanelOpen, setIsStatusPanelOpen] = useState(false);

  const mapContainer = useRef(null);

  const BASE_URL = 'https://ride-wise-server.vercel.app';
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

    if (mapContainer.current) {
      initializeMap();
    }
  }, [mapContainer]);


  
  const initializeMap = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      // Initialize the map
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,  // Make sure this is an HTMLElement
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 12,
      });

      newMap.on('load', () => {
        setMap(newMap);
      });

      // Add user location marker
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
      // Clear existing route
      clearRoute();

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0]},${pickup[1]};${dropoff[0]},${dropoff[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      
      if (json.routes && json.routes[0]) {
        const data = json.routes[0];
        const route = data.geometry;
        
        // Calculate distance and duration
        const distanceInKm = (data.distance / 1000).toFixed(2);
        const durationInMinutes = Math.round(data.duration / 60);
        setDistance(distanceInKm);
        setDuration(durationInMinutes);

        // Create GeoJSON object
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates
          }
        };

        // Add the route layer
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

        // Fit map to show the entire route
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

  // const vehicleTypes = {
  //   'Sedan': { baseRate: 10, vehicles: ['Toyota Camry', 'Honda Civic'] },
  //   'SUV': { baseRate: 20, vehicles: ['Toyota Fortuner', 'Ford Endeavour'] },
  //   'Luxury': { baseRate: 30, vehicles: ['Mercedes Benz', 'BMW 5 Series'] }
  // };

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
      
      // Fly to the selected location
      map.flyTo({
        center: [lng, lat],
        zoom: 12,
        duration: 2000
      });
    } else {
      setDropoffLocation(placeName);
      setDropoffSearch(placeName);
      setDropoffSuggestions([]);
      if (dropoffMarker) dropoffMarker.remove();
      const newMarker = new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat([lng, lat])
        .addTo(map);
      setDropoffMarker(newMarker);
      
      // Fly to the selected location
      map.flyTo({
        center: [lng, lat],
        zoom: 12,
        duration: 2000
      });
    }

    // Draw route only if both markers are present
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
    setShowPrices(false);
    setVehicles([]);
    setSelectedVehicle('');
    if(!dropoffMarker) 
      {
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
    setShowPrices(false);
    setVehicles([]);
    setSelectedVehicle('');
    if(!pickupMarker) 
      {
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.email) {
        try {
          const response = await axios.get(`https://ride-wise-server.vercel.app/api/auth/user/${user.email}`);
          setIsRegistrationComplete(response.data.userType === 'passenger');
          setIsLoggedIn(response.data.userType === 'passenger');
          if (response.data.userType === 'passenger') {
            setPassengerId(response.data.passengerId);
          }
        } catch (error) {
          console.error('Error checking user registration:', error);
          setIsLoggedIn(false);
          setIsRegistrationComplete(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsRegistrationComplete(false);
        resetComponent();
      }
    });

    return () => unsubscribe();
  }, []);

  const searchLocation = async (query, isPickup = true) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const placeName = data.features[0].place_name;

        if (isPickup) {
          setPickupLocation(placeName);
          if (pickupMarker) pickupMarker.remove();
          const newMarker = new mapboxgl.Marker({ color: '#00ff00' })
            .setLngLat([lng, lat])
            .addTo(map);
          setPickupMarker(newMarker);
        } else {
          setDropoffLocation(placeName);
          if (dropoffMarker) dropoffMarker.remove();
          const newMarker = new mapboxgl.Marker({ color: '#ff0000' })
            .setLngLat([lng, lat])
            .addTo(map);
          setDropoffMarker(newMarker);
        }

        map.flyTo({
          center: [lng, lat],
          zoom: 12,
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const resetComponent = () => {
    setPickupLocation('');
    setDropoffLocation('');
    setPickupSearch('');
    setDropoffSearch('');
    setSelectedDate('');
    setSelectedTime('12:00');
    setVehicles([]);
    setSelectedVehicle('');
    setShowPrices(false);
    setDistance(null);
    setDuration(null);
    if (pickupMarker) {
      pickupMarker.remove();
      setPickupMarker(null);
    }
    if (dropoffMarker) {
      dropoffMarker.remove();
      setDropoffMarker(null);
    }
    clearRoute();
    initializeMap();
  };


  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setShowPrices(false);
    setVehicles([]);
    setSelectedVehicle('')
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
    setShowPrices(false);
    setVehicles([]);
    setSelectedVehicle('')
  };

  const handleSeePricesClick = async () => {
    if (!isLoggedIn || !isRegistrationComplete) {
      setShowLoginMessage(true);
      setShowPrices(false);
      setTimeout(() => {
        setShowLoginMessage(false);
        setAllfields(false);
      }, 3000);
      return;
    }
  
    if (pickupLocation && dropoffLocation && selectedDate && selectedTime) {
      try {
        setIsLoading(true);
        const response = await axios.post('https://ride-wise-server.vercel.app/api/booking/check-availability', {
          pickupLocation,
          dropoffLocation,
          date: selectedDate,
          time: selectedTime,
          distance: parseFloat(distance)
        });
  
        if (response.data.success) {
          setVehicles(response.data.vehicles);
          console.log('Vehicles:', response.data.vehicles);
          setShowPrices(true);
          setAllfields(true);
          setShowLoginMessage(false);
          setAllfmsg(false);
          setNoVehiclesMessage(false);
          setIsPanelOpen(true); // Open the panel when vehicles are loaded
        } else {
          setShowPrices(false);
          setNoVehiclesMessage(true);
          setTimeout(() => {
            setNoVehiclesMessage(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking vehicle availability:', error);
        setShowPrices(false);
        setNoVehiclesMessage(true);
        setTimeout(() => {
          setNoVehiclesMessage(false);
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    } else {
      setAllfmsg(true);
      setTimeout(() => {
        setAllfmsg(false);
      }, 3000);
    }
  };

  const handleBookClick = () => {
    if (selectedVehicle) {
      alert(`You have booked ${selectedVehicle}!`);
      resetComponent();
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto mt-24 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Booking Form - now 1/3 width */}
        <div className="w-full lg:w-[650px]">
          <div className="bg-white border-[1px] border-black overflow-hidden">
            {/* Header */}
            <div className="relative bg-white border-b-2 border-gray-100 px-6 py-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Book Your Journey</h2>
                  <p className="text-gray-600 mt-1">Find the perfect ride for your trip</p>
                </div>
                <div className="flex items-center gap-4">
                  {isLoggedIn && (
                    <button
                      onClick={() => setIsStatusPanelOpen(true)}
                      className="px-4 py-2 bg-white border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <Clock className="h-5 w-5" />
                      View Booking Status
                    </button>
                  )}
                  <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Navigation className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
  
            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Location Section */}
                <div className="border-2 border-gray-100 rounded-lg p-6 hover:border-orange-200 transition-colors duration-300">
                  <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                    <MapPin className="mr-2 h-5 w-5 text-orange-500" />
                    Select Locations
                  </h3>
                  <div className="space-y-4">
                    <SearchField
                      icon="fa-map-marker-alt text-green-500"
                      placeholder="Pickup Location"
                      value={pickupSearch}
                      onChange={setPickupSearch}
                      suggestions={pickupSuggestions}
                      onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, true)}
                      isLoading={isLoadingPickup}
                      onClear={clearPickupLocation}
                      className="bg-gray-50 focus:bg-white transition-colors duration-300"
                    />
                    <div className="relative">
                      <div className="absolute left-1/2 -translate-x-1/2 h-6 w-px bg-gray-300"></div>
                    </div>
                    <SearchField
                      icon="fa-map-marker-alt text-red-500"
                      placeholder="Dropoff Location"
                      value={dropoffSearch}
                      onChange={setDropoffSearch}
                      suggestions={dropoffSuggestions}
                      onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, false)}
                      isLoading={isLoadingDropoff}
                      onClear={clearDropoffLocation}
                      className="bg-gray-50 focus:bg-white transition-colors duration-300"
                    />
                  </div>
                </div>
  
                {/* Schedule Section */}
                <div className="border-2 border-gray-100 rounded-lg p-6 hover:border-orange-200 transition-colors duration-300">
                  <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                    <Calendar className="mr-2 h-5 w-5 text-orange-500" />
                    Schedule Your Ride
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
  
                {/* Price Button */}
                <button
                  onClick={handleSeePricesClick}
                  disabled={!pickupLocation || !dropoffLocation || !selectedDate || !selectedTime}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span>Check Available Vehicles</span>
                  </div>
                </button>
  
                {/* Messages Section */}
                {showLoginMessage && (
                  <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <p className="text-orange-800 font-medium mb-2">
                          Please log in as a passenger to proceed
                        </p>
                        <Link 
                          href="/auth" 
                          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Sign in to your account <span className="ml-2">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
  
                {/* Other alert messages */}
                {allfmsg && !allfields && (
                  <div className="border-2 border-red-200 bg-red-50 rounded-lg p-6">
                    <p className="text-red-800 font-medium">
                      All fields are required to proceed
                    </p>
                  </div>
                )}
  
                {noVehiclesMessage && (
                  <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-6 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <p className="text-yellow-800 font-medium">
                          No vehicles available for the selected route and time. Please try different options.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
  
                {isLoading && (
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <p className="text-blue-800 font-medium">
                        Checking available vehicles...
                      </p>
                    </div>
                  </div>
                )}
  
                {/* Vehicle Selection */}
                {showPrices && (
                  <VehicleList
                    vehicles={vehicles}
                    selectedVehicle={selectedVehicle}
                    setSelectedVehicle={setSelectedVehicle}
                    isOpen={isPanelOpen}
                    onClose={() => setIsPanelOpen(false)}
                    passengerId={passengerId}
                    pickupLocation={pickupLocation}
                    dropoffLocation={dropoffLocation}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    distance={distance}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
  
        {/* Map and Trip Details Section - now 2/3 width */}
        <div className="w-full lg:w-[850px]">
          <div className="sticky top-8">
            {/* Map Container */}
            <div className="border-[1px] border-black p-3 bg-white hover:border-orange-200 transition-colors duration-300">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <Map mapContainer={mapContainer} className="h-[600px] w-full" />
              </div>
            </div>
            {distance && duration && (
              <div className="">
                <TripDetails distance={distance} duration={duration} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isLoggedIn && (
        <BookingStatusPanel 
          isOpen={isStatusPanelOpen}
          onClose={() => setIsStatusPanelOpen(false)}
          passengerId={passengerId}
        />
      )}
    </div>
  );
};

export default BookingApp;