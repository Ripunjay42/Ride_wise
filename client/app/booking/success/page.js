// app/booking/success/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { CheckCircle, MapPin, Calendar, Clock, Car, Phone, User } from 'lucide-react';

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pnr = searchParams.get('pnr');

  const BASE_URL = 'https://ride-wise-server.vercel.app';

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://ride-wise-server.vercel.app/api/booking/pnr/${pnr}`);
        setBookingDetails(response.data.booking);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    if (pnr) {
      fetchBookingDetails();
    }
  }, [pnr]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Return Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent>
            {bookingDetails && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Your PNR Number</p>
                  <p className="text-lg font-bold">{bookingDetails.pnr}</p>
                </div>

                {/* Location Details */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-medium">{bookingDetails.locationFrom}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Drop Location</p>
                      <p className="font-medium">{bookingDetails.locationTo}</p>
                    </div>
                  </div>
                </div>

                {/* Time and Date */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(bookingDetails.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{formatTime(bookingDetails.time)}</p>
                    </div>
                  </div>
                </div>

                {/* Driver Details */}
                {bookingDetails.driver && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Car className="h-5 w-5 text-orange-500" />
                      Driver Details
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500">Name:</span>{' '}
                        <span className="font-medium">{bookingDetails.driver.name}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Vehicle:</span>{' '}
                        <span className="font-medium">{bookingDetails.driver.vehicleNumber} ({bookingDetails.driver.vehicleType})</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Contact:</span>{' '}
                        <span className="font-medium">{bookingDetails.driver.phoneNumber}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Price Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="text-lg font-bold text-green-600">₹{bookingDetails.price}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total Distance: {bookingDetails.distance} km
                  </div>
                </div>

                <button
                  onClick={() => router.push('/')}
                  className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                >
                  Back to Home
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;