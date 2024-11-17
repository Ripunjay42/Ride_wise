import React from 'react';
import { Star, Clock, CheckCircle, X, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const VehicleList = ({ 
  vehicles, 
  selectedVehicle, 
  setSelectedVehicle, 
  isOpen, 
  onClose, 
  passengerId,
  pickupLocation,
  dropoffLocation,
  selectedDate,  
  selectedTime,
  distance 
}) => {
  const router = useRouter();
  
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const handleConfirmBooking = (driver) => {
    // Find the selected vehicle details
    const selectedVehicleDetails = Object.values(vehicles)
      .flat()
      .find(v => v.vehicleNumber === selectedVehicle);

      console.log(selectedVehicleDetails);

    if (!selectedVehicleDetails) return;

    // Construct query parameters for payment page
    const params = new URLSearchParams({
      scheduleId: selectedVehicleDetails.scheduleId,
      passengerId,
      driverId: selectedVehicleDetails.driverId,
      pickupLocation: encodeURIComponent(pickupLocation),
      dropoffLocation: encodeURIComponent(dropoffLocation),
      date: selectedDate,
      time: selectedTime,
      price: selectedVehicleDetails.price.replace('₹', ''),
      distance: distance,
      vehicleNumber: selectedVehicleDetails.vehicleNumber,
      driverName: selectedVehicleDetails.driverName
    });

    // Redirect to payment page
    router.push(`/payment?${params.toString()}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:max-w-2xl bg-slate-200 border-[1px] border-black shadow-2xl"
          >
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Car className="h-6 w-6" />
                  Available Vehicles
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid gap-6">
                  {Object.entries(vehicles).map(([type, drivers]) => (
                    <div key={type} className="bg-white rounded-xl shadow-lg">
                      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-t-xl">
                        <h4 className="text-xl font-semibold text-white">{type}</h4>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {drivers.map((driver, index) => (
                          <motion.div
                            key={driver.scheduleId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 hover:bg-gray-50 transition-all cursor-pointer"
                            onClick={() => setSelectedVehicle(driver.vehicleNumber)}
                          >
                            <div className="flex items-start gap-4">
                              <input
                                type="radio"
                                name="vehicle"
                                checked={selectedVehicle === driver.vehicleNumber}
                                onChange={() => setSelectedVehicle(driver.vehicleNumber)}
                                className="mt-1 h-4 w-4 cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-semibold">{driver.driverName}</p>
                                    <p className="text-sm text-gray-500">{driver.vehicleNumber}</p>
                                    <div className="flex items-center mt-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <span className="ml-1 text-sm">{driver.rating}</span>
                                    </div>
                                  </div>
                                  <div className="text-lg font-bold text-green-600">
                                    {driver.price}
                                  </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                  <Clock className="inline-block h-4 w-4 mr-1" />
                                  {formatTime(driver.pickupTime)} - {formatTime(driver.dropoffTime)}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedVehicle && (
                <div className="border-t border-gray-200 bg-white p-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmBooking}
                    className="w-full rounded-lg bg-gradient-to-r from-orange-600 to-orange-400 px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-600"
                  >
                    Proceed to Payment
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VehicleList;