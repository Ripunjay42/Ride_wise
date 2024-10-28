'use client';

import React, { useCallback, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';

const Map = ({ pickupLocation, dropoffLocation, setDistance }) => {
    const mapRef = useRef(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    });

    const [directions, setDirections] = React.useState(null);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    React.useEffect(() => {
        if (pickupLocation && dropoffLocation) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: pickupLocation,
                    destination: dropoffLocation,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                        setDistance(result.routes[0].legs[0].distance.value / 1000); // Distance in km
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        }
    }, [pickupLocation, dropoffLocation, setDistance]);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            onLoad={onMapLoad}
            center={pickupLocation || { lat: 37.7749, lng: -122.4194 }}
            zoom={10}
            mapContainerStyle={{ width: '100%', height: '100%' }}
        >
            {pickupLocation && <Marker position={pickupLocation} label="P" />}
            {dropoffLocation && <Marker position={dropoffLocation} label="D" />}
            {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
    );
};

export default Map;
