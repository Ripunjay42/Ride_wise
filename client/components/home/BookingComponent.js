import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { auth } from '@/components/firebase/firebaseconfig';
import axios from 'axios';
import Link from 'next/link';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Card = ({ children }) => (
  <div className="bg-white shadow-md rounded-lg p-6">{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold mb-2 flex items-center">
    <i className="fas fa-car mr-4 text-blue-500"></i>
    {children}
  </h2>
);

const CardContent = ({ children }) => <div>{children}</div>;

const SearchField = ({ 
  icon, 
  placeholder, 
  value, 
  onChange, 
  suggestions, 
  onSuggestionClick,
  isLoading,
  onClear 
}) => {
  const wrapperRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className={`flex items-center w-full border-2 rounded-lg px-4 py-3 bg-white transition-all duration-200 ${
          isFocused 
            ? 'border-blue-500 shadow-md' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            icon.includes('green') ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <i className={`fas ${icon} text-lg ${
              icon.includes('green') ? 'text-green-500' : 'text-red-500'
            }`}></i>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setShowSuggestions(true);
              setIsFocused(true);
            }}
            className="w-full ml-3 focus:outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          )}
          {value && (
            <button
              onClick={() => {
                onClear();
                setShowSuggestions(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
            </button>
          )}
        </div>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => {
                onSuggestionClick(suggestion);
                setShowSuggestions(false);
                setIsFocused(false);
              }}
            >
              <div className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    <i className="fas fa-map-marker-alt text-gray-500"></i>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{suggestion.text}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {suggestion.place_name.replace(suggestion.text + ', ', '')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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



  // Effect for fetching suggestions
  useEffect(() => {
    fetchSuggestions(debouncedPickupSearch, true);
  }, [debouncedPickupSearch]);

  useEffect(() => {
    fetchSuggestions(debouncedDropoffSearch, false);
  }, [debouncedDropoffSearch]);

  const handleSuggestionClick = (suggestion, isPickup = true) => {
    const [lng, lat] = suggestion.center;
    const placeName = suggestion.place_name;

    if (isPickup) {
      setPickupLocation(placeName);
      setPickupSearch(placeName);
      setPickupSuggestions([]); // Clear suggestions immediately
      if (pickupMarker) pickupMarker.remove();
      const newMarker = new mapboxgl.Marker({ color: '#00ff00' })
        .setLngLat([lng, lat])
        .addTo(map);
      setPickupMarker(newMarker);
    } else {
      setDropoffLocation(placeName);
      setDropoffSearch(placeName);
      setDropoffSuggestions([]); // Clear suggestions immediately
      if (dropoffMarker) dropoffMarker.remove();
      const newMarker = new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat([lng, lat])
        .addTo(map);
      setDropoffMarker(newMarker);
    }

    map.flyTo({
      center: [lng, lat],
      zoom: 14,
    });
  };

  // Update the fetchSuggestions function to clear suggestions when query is empty
  const clearPickupLocation = () => {
    setPickupLocation('');
    setPickupSearch('');
    if (pickupMarker) {
      pickupMarker.remove();
      setPickupMarker(null);
    }
  };

  const clearDropoffLocation = () => {
    setDropoffLocation('');
    setDropoffSearch('');
    if (dropoffMarker) {
      dropoffMarker.remove();
      setDropoffMarker(null);
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
          const response = await axios.get(`http://localhost:3001/api/auth/user/${user.email}`);
          setIsRegistrationComplete(response.data.userType === 'passenger');
          setIsLoggedIn(response.data.userType === 'passenger');
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
          zoom: 8,
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
    setMap(null);
    if (pickupMarker) pickupMarker.remove();
    if (dropoffMarker) dropoffMarker.remove();
  };

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3BpZGVybmlzaGFudGEiLCJhIjoiY20ydW5ubGZuMDNlZTJpc2I1N2o3YWo0aiJ9.tKmf9gr1qgyi_N7WOaPoZw';

    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],
        zoom: 9,
      });

      newMap.on('load', () => {
        setMap(newMap);
      });

      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const marker = new mapboxgl.Marker({ color: '#0000ff' })
          .setLngLat([longitude, latitude])
          .addTo(newMap);
        setUserLocationMarker(marker);
        newMap.flyTo({
          center: [longitude, latitude],
          zoom: 12,
        });
      });

      return () => {
        newMap.remove();
        if (userLocationMarker) userLocationMarker.remove();
        if (pickupMarker) pickupMarker.remove();
        if (dropoffMarker) dropoffMarker.remove();
      };
    };

    initializeMap();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSeePricesClick = () => {
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
      setShowPrices(true);
      setAllfields(true);
      setShowLoginMessage(false);
      setAllfmsg(false);
      const demoVehicles = [
        { type: 'Car1', price: '₹500' },
        { type: 'Car2', price: '₹700' },
        { type: 'Car3', price: '₹1000' },
      ];
      setVehicles(demoVehicles);
    }

    if (!allfields) {
      setAllfmsg(true);
      setTimeout(() => {
        setAllfmsg(false);
      }, 3000);
    }
  };

  const handleBookClick = () => {
    if (selectedVehicle) {
      alert(`You have booked ${selectedVehicle}!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20">
      <div className="flex flex-col md:flex-row gap-8 my-8">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>BOOK A RIDE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-4">
                    <label className="font-semibold text-lg">
                      <i className="fas fa-map-marker-alt mr-3 text-green-500 text-3xl"></i>
                      Search Locations
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

                <div>
                  <label className="block font-medium mb-1">Select Date</label>
                  <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                    <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>
                    <input
                      type="date"
                      className="w-full border-none focus:outline-none"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Select Time</label>
                  <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                    <i className="fas fa-clock mr-2 text-orange-500"></i>
                    <input
                      type="time"
                      className="w-full border-none focus:outline-none"
                      value={selectedTime}
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSeePricesClick}
                  className="w-full group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="absolute inset-0 w-3 bg-gradient-to-r from-white to-transparent opacity-10 transform -skew-x-12 group-hover:animate-shine"></div>
                  <i className="fas fa-tag mr-2 group-hover:animate-wiggle"></i>
                  <span className="tracking-wide">See Prices</span>
                </button>

                {showLoginMessage && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-red-600 mb-2">Please log in as a passenger to see prices and book a ride.</p>
                  </div>
                )}

                {allfmsg && !allfields && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-red-600 mb-2">Please fill all the required fields.</p>
                  </div>
                )}

                {showPrices && (
                  <div className="mt-4">
                    <h3 className="font-bold">Available Vehicles:</h3>
                    <ul className="list-disc list-inside">
                      {vehicles.map((vehicle, index) => (
                        <li key={index} className="flex items-center">
                          <input
                            type="radio"
                            id={`vehicle-${index}`}
                            name="vehicle"
                            value={vehicle.type}
                            onChange={(e) => setSelectedVehicle(e.target.value)}
                          />
                          <label htmlFor={`vehicle-${index}`} className="ml-2">
                            {vehicle.type} - {vehicle.price}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedVehicle && (
                  <button
                    onClick={handleBookClick}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 mt-4"
                  >
                    Book {selectedVehicle}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 mt-8">
          <div className="w-full h-[500px]" ref={mapContainer}></div>
        </div>
      </div>
    </div>
  );
};

export default BookingApp;