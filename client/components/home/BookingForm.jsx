import React, { useState } from 'react';
import LocationInput from './LocationInput';
import Map from './Map';

const BookingForm = () => {
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [distance, setDistance] = useState(0);
    const [price, setPrice] = useState(null);

    const handleCalculatePrice = () => {
        const baseRate = 10; // Basic price per km
        const total = distance * baseRate;
        setPrice(total.toFixed(2));
    };

    return (
        <div className="flex flex-col max-w-7xl mx-auto p-4">
            <div className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Go anywhere with Uber</h2>
                <LocationInput label="Pickup Location" setLocation={setPickupLocation} />
                <LocationInput label="Dropoff Location" setLocation={setDropoffLocation} />
                <button
                    onClick={handleCalculatePrice}
                    className="bg-black text-white px-4 py-2 rounded mt-4"
                >
                    Show Price
                </button>
                {price && <div className="mt-2 text-lg">Estimated Price: ${price}</div>}
            </div>
            <div className="w-full h-96 mt-6">
                <Map
                    pickupLocation={pickupLocation}
                    dropoffLocation={dropoffLocation}
                    setDistance={setDistance}
                />
            </div>
        </div>
    );
};

export default BookingForm;
