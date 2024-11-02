import React from 'react';
import { Clock, Shield, MapPin, CreditCard } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 p-3 bg-blue-50 rounded-full">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const FeaturesSection = () => {
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
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose RideWise</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the best ride-booking service with features designed to make your journey comfortable and hassle-free.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;