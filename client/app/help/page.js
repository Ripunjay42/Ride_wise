import React from 'react';
import Link from 'next/link';
import { Car, LifeBuoy, Bike, Briefcase, Truck } from 'lucide-react';

const HelpCard = ({ icon: Icon, title, href }) => (
  <Link href={href || "#"}>
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-blue-50 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
      </div>
    </div>
  </Link>
);

const HelpSection = () => {
  const features = [
    {
      icon: Car,
      title: "Riders",
      href: "/help/riders"
    },
    {
      icon: LifeBuoy,
      title: "Driving & Delivering",
      href: "/help/driving-and-delivering"
    },
    {
      icon: Bike,
      title: "Bikes & Scooters",
      href: "/help/bikes-and-scooters"
    },
    {
      icon: Briefcase,
      title: "Business",
      href: "/help/business"
    },
    {
      icon: Truck,
      title: "Freight",
      href: "/help/freight"
    }
  ];

  return (
    <div className="bg-gray-50 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Welcome to RideWise Support</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We’re here to help. Looking for customer service contact information? Explore support resources for the relevant products below to find the best way to reach out about your issue.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <HelpCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
