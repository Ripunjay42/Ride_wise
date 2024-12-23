import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, ChevronRight, X, Loader2, CheckCircle, Filter } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import StatusProgressBar from './StatusProgressBar';

const DriverSchedules = ({ driverId }) => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [currentPnrDetails, setCurrentPnrDetails] = useState(null);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);

  const scheduleRef = useRef(null);

  const BASE_URL = 'https://ride-wise-server.vercel.app';

  const statusOptions = [
    { value: 'all', label: 'All Schedules' },
    { value: 'active', label: 'Active' },
    { value: 'busy', label: 'Busy' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const filterSchedules = (status) => {
    setSelectedStatus(status);
    if (status === 'all') {
      setFilteredSchedules(schedules);
    } else {
      setFilteredSchedules(schedules.filter(schedule => 
        schedule.status.toLowerCase() === status.toLowerCase()
      ));
    }
  };
  const fetchSchedules = async () => {
    if (!driverId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://ride-wise-server.vercel.app/api/schedules/driver/${driverId}`);
      setSchedules(response.data);
      setFilteredSchedules(response.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err.response?.data?.error || 'Failed to fetch schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPnrDetails = async (scheduleId) => {
    console.log('Fetching PNR details:', scheduleId);
    try {
      const response = await axios.get(`https://ride-wise-server.vercel.app/api/pnr/schedule/${scheduleId}`);
      setCurrentPnrDetails(response.data.booking);
    } catch (err) {
      console.error('Error fetching PNR details:', err);
    }
  };

  const handleCompleteRide = async (scheduleId) => {
    console.log('Completing ride:', scheduleId);
    try {
      await fetchPnrDetails(scheduleId);
      const response = await axios.post(`https://ride-wise-server.vercel.app/api/schedules/${scheduleId}/send-otp`);
      console.log('OTP sent:', response.data);
      if (response.data.success) {
        setSelectedScheduleId(scheduleId);
        setIsOtpModalOpen(true);
        setOtp('');
        setOtpError('');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setOtpVerificationLoading(true);
      setOtpError('');

      const response = await axios.post(`https://ride-wise-server.vercel.app/api/schedules/${selectedScheduleId}/verify-otp`, {
        otp,
        pnrId: currentPnrDetails.pnr
      });

      if (response.data.success) {
        setSchedules(prevSchedules =>
          prevSchedules.map(schedule =>
            schedule.id === selectedScheduleId
              ? { ...schedule, status: 'completed' }
              : schedule
          )
        );
        setIsOtpModalOpen(false);
        setSelectedScheduleId(null);
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  const confirmCancelSchedule = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    setIsCancelModalOpen(true);
  };

  const handleCancelSchedule = async () => {
    try {
      setSchedules(prevSchedules =>
        prevSchedules.map(schedule =>
          schedule.id === selectedScheduleId
            ? { ...schedule, status: 'cancelled' }
            : schedule
        )
      );

      await axios.put(`https://ride-wise-server.vercel.app/api/schedules/${selectedScheduleId}/cancel`);
      setIsCancelModalOpen(false);
      setSelectedScheduleId(null);
    } catch (err) {
      console.error('Error cancelling schedule:', err);
      fetchSchedules();
      setError(err.response?.data?.error || 'Failed to cancel schedule. Please try again.');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      },
      completed: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      },
      cancelled: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
      },
      default: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
      },
    };
    return configs[status.toLowerCase()] || configs.default;
  };

  useEffect(() => {
    if (showAllSchedules) {
      fetchSchedules();
    }
  }, [showAllSchedules, driverId]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (scheduleRef.current && !scheduleRef.current.contains(event.target) && !isCancelModalOpen) {
        setShowAllSchedules(false);
      }
    };

    // Attach event listener to document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },  [isCancelModalOpen]);

  if (!driverId) return null;

  const ScheduleCard = ({ schedule }) => {
    const statusConfig = getStatusConfig(schedule.status);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
      >
        <div className="space-y-4">
          {/* Status Progress Bar */}
          <div className="mb-6">
            <StatusProgressBar status={schedule.status.toLowerCase()} />
          </div>

          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Trip Schedule
              </h3>
              <p className="text-sm text-gray-500">ID: #{schedule.id}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
              {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
            </span>
          </div>

          {schedule.status === 'busy' && currentPnrDetails && (
            <div className="bg-blue-50 rounded-lg p-3 mt-2">
              <p className="text-sm font-medium text-blue-700">
                PNR: {currentPnrDetails.pnr}
              </p>
              <p className="text-sm text-blue-600">
                Passenger: {currentPnrDetails.passenger?.name}
              </p>
            </div>
          )}

          {/* Time and Date */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">
                {new Date(schedule.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-5 w-5" />
              <span className="font-medium">
                {schedule.timeFrom} - {schedule.timeTo}
              </span>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <div className="relative pl-8">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-red-500"></div>
              <div className="space-y-4">
                <div>
                  <div className="absolute left-2.5 -translate-x-1/2 w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-700">Pickup Location</p>
                    <p className="text-gray-700">{schedule.pickupLocation}</p>
                  </div>
                </div>
                <div>
                  <div className="absolute left-2.5 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-red-700">Dropoff Location</p>
                    <p className="text-gray-700">{schedule.dropoffLocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          {/* Action Buttons */}
          <div className="flex gap-3">
            {schedule.status === 'busy' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCompleteRide(schedule.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Complete Ride
              </motion.button>
            )}
            
            {schedule.status === 'active' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => confirmCancelSchedule(schedule.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel Schedule
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAllSchedules(true)}
        className="fixed bottom-6 right-6 border-[1px] border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full p-4 shadow-lg flex items-center gap-2 hover:shadow-xl transition-all z-10"
      >
        <Calendar className="h-5 w-5" />
        <span>View Schedules</span>
        <ChevronRight className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {showAllSchedules && (
          <motion.div
            ref={scheduleRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:max-w-3xl bg-slate-200 border-[1px] border-black shadow-2xl z-50"
          >
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Schedule Dashboard
                </h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowAllSchedules(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Status Filter Section */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter by Status</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => filterSchedules(option.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedStatus === option.value
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : filteredSchedules.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Schedules Found</h3>
                    <p className="text-gray-500">
                      {selectedStatus === 'all' 
                        ? 'Your schedule list is currently empty.'
                        : `No ${selectedStatus} schedules found.`}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {filteredSchedules.map((schedule) => (
                      <ScheduleCard key={schedule.id} schedule={schedule} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

       {/* OTP Verification Modal */}
       <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Passenger OTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-lg tracking-wider"
              maxLength={6}
            />
            {otpError && (
              <p className="text-sm text-red-600">{otpError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={otpVerificationLoading}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                {otpVerificationLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify OTP
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg p-6 w-11/12 md:w-1/3"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Cancel</h3>
              <p className="text-gray-700 mb-6">Are you sure you want to cancel this schedule?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  No
                </button>
                <button
                  onClick={handleCancelSchedule}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverSchedules;
