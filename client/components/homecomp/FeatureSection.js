import React from 'react';
import { Clock, Shield, MapPin, CreditCard } from 'lucide-react';

const PassengerFeatures = () => {
  const features = [
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Book rides anytime, day or night. Our service never sleeps, just like your city."
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Verified drivers, real-time tracking, and 24/7 customer support for your peace of mind."
    },
    {
      icon: MapPin,
      title: "Flexible Pickup",
      description: "Choose your pickup location anywhere in the city. We'll be there in minutes."
    },
    {
      icon: CreditCard,
      title: "Easy Payment",
      description: "Multiple payment options available. Pay securely with cash or card."
    }
  ];

  return (
    <div className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-blackto-white opacity-50" />
      <div className="absolute -right-40 -top-40 w-80 h-80 bg-white rounded-full blur-3xl opacity-30" />
      <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-white rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-800 to-gray-950 bg-clip-text text-transparent">
              Why Passengers Love RideWise
            </span>
          </h2>
          <p className="text-gray-600 text-md max-w-2xl mx-auto">
            Experience the best ride-booking service with features designed to make your journey comfortable and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl border border-gray-500"
              >
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-black to-gray-900 rounded-2xl text-white transform group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-black transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 transition-transform group-hover:scale-105" />
            <a className="relative flex items-center" href="#top">
              Book Your Ride Now
              <svg 
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengerFeatures;