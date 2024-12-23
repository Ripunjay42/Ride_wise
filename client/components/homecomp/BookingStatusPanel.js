import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Car, X, AlertCircle, Search } from 'lucide-react';
import axios from 'axios';
import RatingModal from './RatingModal'; 

const BookingStatusPanel = ({ isOpen, onClose, passengerId }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);
  const BASE_URL = 'https://ride-wise-server.vercel.app';
  useEffect(() => {
    if (isOpen && passengerId) {
      fetchBookings();
    }
  }, [isOpen, passengerId]);

  const fetchBookings = async () => {
    try {
        console.log('Fetching bookings for passenger:', passengerId);
      setIsLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/api/booking/passenger/${passengerId}`);
      console.log(response.data);
      if (response.data.success) {
        setBookings(response.data.bookings);
        console.log('Bookings:', response.data.bookings);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const filteredBookings = bookings
    .filter(booking => filterStatus === 'all' || booking.status === filterStatus)
    .filter(booking => 
      booking.locationFrom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.locationTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pnr?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRateDriverClick = (vehicleNumber, pnr) => {
      setSelectedBookingForRating({ vehicleNumber, pnr });
      setRatingModalOpen(true);
    };
  
    const handleRatingSubmit = () => {
      // Optionally refresh bookings or update local state
      fetchBookings();
    };

  return (
    <>
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
            className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:max-w-2xl bg-gray-50 shadow-xl overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Car className="h-6 w-6" />
                    Your Bookings
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white border-b p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <FilterButton
                    active={filterStatus === 'all'}
                    onClick={() => setFilterStatus('all')}
                    className="bg-orange-100 text-orange-800 border-orange-200"
                  >
                    All
                  </FilterButton>
                  <FilterButton
                    active={filterStatus === 'active'}
                    onClick={() => setFilterStatus('active')}
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    Active
                  </FilterButton>
                  <FilterButton
                    active={filterStatus === 'completed'}
                    onClick={() => setFilterStatus('completed')}
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Completed
                  </FilterButton>
                  <FilterButton
                    active={filterStatus === 'cancelled'}
                    onClick={() => setFilterStatus('cancelled')}
                    className="bg-red-100 text-red-800 border-red-200"
                  >
                    Cancelled
                  </FilterButton>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <LoadingState />
                ) : error ? (
                  <ErrorState error={error} />
                ) : filteredBookings.length === 0 ? (
                  <EmptyState searchTerm={searchTerm} filterStatus={filterStatus} />
                ) : (
                  <BookingsList 
                    bookings={filteredBookings} 
                    getStatusColor={getStatusColor}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    onRateDriver={handleRateDriverClick}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Rating Modal */}
    <RatingModal 
    isOpen={ratingModalOpen}
    onClose={() => setRatingModalOpen(false)}
    vehicleNumber={selectedBookingForRating?.vehicleNumber}
    pnr={selectedBookingForRating?.pnr}
    onSubmit={handleRatingSubmit}
  />
</>
  );
};

const FilterButton = ({ active, onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
      active ? className : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const LoadingState = () => (
  <div className="flex justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center gap-2 text-red-700">
      <AlertCircle className="h-5 w-5" />
      <p>{error}</p>
    </div>
  </div>
);

const EmptyState = ({ searchTerm, filterStatus }) => (
  <div className="text-center py-8 text-gray-500">
    {searchTerm || filterStatus !== 'all' 
      ? 'No bookings match your search criteria.' 
      : 'You have no bookings yet.'}
  </div>
);

const BookingsList = ({ 
  bookings, 
  getStatusColor, 
  formatDate, 
  formatTime, 
  onRateDriver 
}) => (
  <div className="space-y-4">
    {bookings.map((booking) => (
      <div 
        key={booking.pnr}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-[1px] border-gray-800"
      >
        {/* Booking Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-sm text-gray-500">PNR Number</span>
              <p className="font-semibold">{booking.pnr}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {formatDate(booking.date)} • {formatTime(booking.time)}
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">Amount</span>
              <p className="font-semibold text-green-600">₹{booking.price}</p>
            </div>
          </div>
        </div>

        {/* Journey Details */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-gray-500">From</span>
                <p className="font-medium">{booking.locationFrom}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-gray-500">To</span>
                <p className="font-medium">{booking.locationTo}</p>
              </div>
            </div>
          </div>

          {/* Driver Details */}
          {booking.driver && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Driver</span>
                    <p className="font-medium">{booking.driver.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Vehicle</span>
                  <p className="font-medium">{booking.driver.vehicleNumber}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {booking.status === 'completed' && booking.driver && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => onRateDriver(booking.driver.vehicleNumber, booking.pnr)}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Rate Driver
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default BookingStatusPanel;