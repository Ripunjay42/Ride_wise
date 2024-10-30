import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { auth } from '@/components/firebase/firebaseconfig';
import axios from 'axios';
import Link from 'next/link';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Card = ({ children }) => (
  <div className="bg-white shadow-md rounded-lg p-6">{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold mb-2 flex items-center">
  <i className="fas fa-car mr-4 text-blue-500"></i> {/* Icon for Book a Ride */}
  {children}
</h2>
);

const CardContent = ({ children }) => <div>{children}</div>;

const BookingApp = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [showPrices, setShowPrices] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropoffMarker, setDropoffMarker] = useState(null);
  const [userLocationMarker, setUserLocationMarker] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const mapContainer = useRef(null);

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

  const resetComponent = () => {
    setPickupLocation('');
    setDropoffLocation('');
    setSelectedDate('');
    setSelectedTime('12:00');
    setVehicles([]);
    setSelectedVehicle('');
    setShowPrices(false);
    setMap(null);
    setDistance(null);
    setPickupMarker(null);
    setDropoffMarker(null);
    setUserLocationMarker(null);
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
        newMap.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [],
            },
          },
        });

        newMap.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });

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

      const pickupGeocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: 'Enter pickup location',
      });

      const dropoffGeocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: 'Enter dropoff location',
      });

      newMap.addControl(pickupGeocoder, 'top-left');
      newMap.addControl(dropoffGeocoder, 'top-left');

      pickupGeocoder.on('result', (event) => {
        const coords = event.result.geometry.coordinates;
        const placeName = event.result.place_name;
        setPickupLocation(placeName);

        if (pickupMarker) pickupMarker.remove();

        const newPickupMarker = new mapboxgl.Marker({ color: '#00ff00' })
          .setLngLat(coords)
          .addTo(newMap);
        setPickupMarker(newPickupMarker);

        if (dropoffMarker) {
          const dropoffCoords = dropoffMarker.getLngLat();
          calculateAndDisplayRoute(coords, [dropoffCoords.lng, dropoffCoords.lat]);
        }
      });

      dropoffGeocoder.on('result', (event) => {
        const coords = event.result.geometry.coordinates;
        const placeName = event.result.place_name;
        setDropoffLocation(placeName);

        if (dropoffMarker) dropoffMarker.remove();

        const newDropoffMarker = new mapboxgl.Marker({ color: '#ff0000' })
          .setLngLat(coords)
          .addTo(newMap);
        setDropoffMarker(newDropoffMarker);

        if (pickupMarker) {
          const pickupCoords = pickupMarker.getLngLat();
          calculateAndDisplayRoute([pickupCoords.lng, pickupCoords.lat], coords);
        }
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

  const calculateAndDisplayRoute = async (start, end) => {
    if (!map) return;

    const query = `${start[1]},${start[0]};${end[1]},${end[0]}`;
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${query}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(directionsUrl);
      if (!response.ok) {
        throw new Error(`Error fetching directions: ${response.statusText}`);
      }
      const data = await response.json();
      const route = data.routes[0];

      if (route) {
        const routeData = {
          type: 'Feature',
          properties: {},
          geometry: route.geometry,
        };

        map.getSource('route').setData(routeData);
        const calculatedDistance = route.distance / 1000; // Convert to kilometers
        setDistance(calculatedDistance.toFixed(2));

        const bounds = new mapboxgl.LngLatBounds()
          .extend(start)
          .extend(end);

        map.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        });
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      setDistance(null);
    }
  };

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
      return;
    }

    if (pickupLocation && dropoffLocation && selectedDate && selectedTime) {
      setShowPrices(true);
      setShowLoginMessage(false);
      const demoVehicles = [
        { type: 'Car1', price: '₹500' },
        { type: 'Car2', price: '₹700' },
        { type: 'Car3', price: '₹1000' },
      ];
      setVehicles(demoVehicles);
    }
  };

  const handleBookClick = () => {
    if (selectedVehicle) {
      alert(`You have booked ${selectedVehicle}!`);
      // Here, you can also add more logic to process the booking.
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
                      <i className="fas fa-map-marker-alt mr-3 text-green-500 text-3xl"></i> {/* Icon for Selected Locations */}
                      Selected Locations
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2">
                      <i className="fas fa-map-marker-alt mr-2 text-green-500"></i>
                      <span>Pickup: {pickupLocation || 'Select pickup location'}</span>
                    </div>
                    <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2">
                      <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                      <span>Dropoff: {dropoffLocation || 'Select dropoff location'}</span>
                    </div>
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
                      min={new Date().toISOString().split("T")[0]} // Set minimum date to today
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
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  See Prices
                </button>

                {showLoginMessage && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-red-600 mb-2">Please log in to see prices and book a ride.</p>
                    {/* <Link href="/auth">
                      <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        Login / Sign Up
                      </button>
                    </Link> */}
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
        <div className="flex-1 mt-24">
          <div className="w-full h-96" ref={mapContainer}></div>
        </div>
      </div>
    </div>
  );
};

export default BookingApp;