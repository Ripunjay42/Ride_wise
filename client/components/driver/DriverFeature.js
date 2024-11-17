import React from 'react';
import { MapPin, Clock, DollarSign, Shield, Star, Users, Bell, Calendar } from 'lucide-react';

export const DriverFeature = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Flexible Routes",
      description: "Set your own pickup and drop-off locations that suit your daily commute",
      color: "from-black to-black"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Convenient Timing",
      description: "Choose your availability and manage your schedule with ease",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Extra Income",
      description: "Earn money by sharing your ride with passengers going your way",
      color: "from-gray-900 to-gray-900"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Secure",
      description: "Verified passengers and secure payment system for peace of mind",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Rating System",
      description: "Build your reputation with our passenger rating and review system",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Join a growing community of trusted drivers and passengers",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Instant Notifications",
      description: "Get real-time alerts for new ride requests and updates",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Advance Booking",
      description: "View and accept ride requests in advance for better planning",
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-black to-gray-900 text-transparent bg-clip-text">
            Why Choose RideWise?
          </h2>
          <p className="text-gray-600 text-md max-w-2xl mx-auto">
            Enjoy the benefits of being a RideWise driver with our feature-rich platform designed to make your journey smooth and profitable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full border border-gray-600">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-8 text-white transform group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 rounded-lg blur-lg opacity-50 animate-pulse"></div>
            <a 
              href="#top"
              className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-black to-gray-900 text-white font-semibold rounded-lg hover:from-black hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Start Scheduling Your Rides
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};