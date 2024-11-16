import React from 'react';
import { Star, Clock, CheckCircle, X, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VehicleList = ({ vehicles, selectedVehicle, onVehicleSelect, isOpen, onClose, onConfirm }) => {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
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
                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={onClose}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid gap-6">
                  {Object.entries(vehicles).map(([type, drivers]) => (
                    <div key={type} className="bg-white rounded-xl shadow-lg border-[1px] border-gray-500">
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
                            onClick={() => onVehicleSelect(driver.vehicleNumber)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-5 items-center">
                                <input
                                  type="radio"
                                  name="vehicle"
                                  checked={selectedVehicle === driver.vehicleNumber}
                                  onChange={() => onVehicleSelect(driver.vehicleNumber)}
                                  className="h-4 w-4 cursor-pointer rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div className="space-y-4">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg font-semibold text-gray-900">
                                          {driver.driverName}
                                        </span>
                                        {index === 0 && (
                                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            <span>Top Rated</span>
                                          </span>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="font-medium">{driver.vehicleNumber}</span>
                                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                                        <div className="flex items-center">
                                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                          <span className="ml-1 font-medium">{driver.rating.toFixed(1)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-center text-sm text-gray-700">
                                        <Clock className="h-4 w-4" />
                                        <span className="ml-2 font-medium">
                                          {formatTime(driver.pickupTime)} - {formatTime(driver.dropoffTime)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col items-end justify-between">
                                    <div className="text-xl font-bold text-indigo-600">
                                      {driver.price}
                                    </div>
                                    {selectedVehicle === driver.vehicleNumber && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="rounded-full bg-indigo-100 p-1.5"
                                      >
                                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                                      </motion.div>
                                    )}
                                  </div>
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
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className="w-full rounded-lg bg-gradient-to-r from-orange-600 to-orange-400 px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-600"
                  >
                    Confirm Booking {selectedVehicle}
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