import React, { useRef } from 'react';

const LocationInput = ({ label, setLocation }) => {
    const inputRef = useRef(null);

    React.useEffect(() => {
        if (typeof window !== 'undefined' && window.google) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
            autocomplete.setFields(['geometry', 'formatted_address']);
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                setLocation({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            });
        }
    }, [setLocation]);

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input ref={inputRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
        </div>
    );
};

export default LocationInput;
