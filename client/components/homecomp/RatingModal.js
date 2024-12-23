import React, { useState } from 'react';
import axios from 'axios';
import { Star, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const RatingModal = ({ isOpen, onClose, vehicleNumber, pnr, onSubmit }) => {
  const [ratings, setRatings] = useState({
    driverBehavior: 0,
    drivingSkill: 0,
    vehicleCleanliness: 0,
    punctuality: 0,
    overallSatisfaction: 0
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const BASE_URL = 'https://ride-wise-server.vercel.app';

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const isSubmitDisabled = Object.values(ratings).some(rating => rating === 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate that vehicleNumber and pnr are present
    if (!vehicleNumber || !pnr) {
      setError('Vehicle Number or Booking PNR is missing');
      return;
    }

    try {
      const payload = {
        vehicleNumber: vehicleNumber,
        pnr: pnr,
        driverBehavior: ratings.driverBehavior,
        drivingSkill: ratings.drivingSkill,
        vehicleCleanliness: ratings.vehicleCleanliness,
        punctuality: ratings.punctuality,
        overallSatisfaction: ratings.overallSatisfaction
      };

      console.log('Rating Payload:', payload);

      const response = await axios.post('https://ride-wise-server.vercel.app/api/booking/rate', payload);

      if (response.data.success) {
        onSubmit();
        setShowSuccess(true);
        // Automatically close success modal after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError(
        error.response?.data?.message || 
        'Failed to submit rating. Please try again.'
      );
    }
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-8 text-center max-w-md mx-4"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 text-white rounded-full p-4">
            <Check className="h-12 w-12" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h2>
        <p className="text-gray-600 mb-4">Your rating has been submitted successfully.</p>
      </motion.div>
    </div>
  );

  if (!isOpen) return null;

  // If success modal is shown, render it instead of the rating form
  if (showSuccess) {
    return <SuccessModal />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-orange-600">Rate Your Driver</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { category: 'driverBehavior', label: 'Driver Behavior' },
            { category: 'drivingSkill', label: 'Driving Skill' },
            { category: 'vehicleCleanliness', label: 'Vehicle Cleanliness' },
            { category: 'punctuality', label: 'Punctuality' },
            { category: 'overallSatisfaction', label: 'Overall Satisfaction' }
          ].map(({ category, label }) => (
            <div key={category} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label 
                    key={value} 
                    className={`flex items-center space-x-1 cursor-pointer 
                      ${ratings[category] === value ? 'text-orange-600' : 'text-gray-400'}
                    `}
                  >
                    <input
                      type="radio"
                      name={category}
                      value={value}
                      checked={ratings[category] === value}
                      onChange={() => handleRatingChange(category, value)}
                      className="sr-only"
                    />
                    <Star 
                      className={`h-6 w-6 ${
                        ratings[category] >= value 
                          ? 'fill-current text-orange-600' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full mt-4 py-2 rounded-lg transition-colors ${
              isSubmitDisabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            Submit Rating
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RatingModal;