import React from 'react';
import { Star, Clock } from 'lucide-react';

export const VehicleList = ({ vehicles, selectedVehicle, onVehicleSelect }) => {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(vehicles).map(([type, drivers]) => (
        <div key={type} className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h4 className="text-lg font-semibold text-gray-800">{type}</h4>
          </div>
          
          <div className="divide-y">
            {drivers.map((driver, index) => (
              <div
                key={driver.scheduleId}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  selectedVehicle === driver.scheduleId
                    ? 'bg-orange-50 hover:bg-orange-100'
                    : 'hover:bg-gray-50'
                } ${index === 0 ? 'bg-green-50' : ''}`}
                onClick={() => onVehicleSelect(driver.scheduleId)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {driver.driverName}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          Top Rated
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Vehicle: {driver.vehicleNumber}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium">
                          {driver.rating.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span className="ml-1 text-sm">
                          {formatTime(driver.pickupTime)} - {formatTime(driver.dropoffTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-lg font-semibold text-orange-600">
                    {driver.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
