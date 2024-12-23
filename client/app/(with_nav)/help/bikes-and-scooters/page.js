"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const Driving = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const helpTopics = [
    { title: "Trips", description: "If you experience an issue on a trip reserved through the RideWise app, connect to support or visit their Help Center." },
    { title: "Why do we share your personal data?", description: "RideWise use this personal data to provide you with the Services, detect and prevent fraud, offer you discounts and other products or services, comply with all applicable regulations, for safety and security purposes and to improve products and services. To make it easy for you to use the Services the next time you open the RideWise app, RideWise will hold onto this data until you request deletion of your personal data." }
    ];

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-24">
      <h1 className="text-3xl font-bold mb-6">Support Resources for RideWise Bike and Scooter Trips</h1>
      <ul className="divide-y divide-gray-200">
        {helpTopics.map((topic, index) => (
          <li key={index} className="py-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <span className="text-lg text-gray-800">{topic.title}</span>
              {expandedIndex === index ? (
                <ChevronDown className="text-gray-400 h-5 w-5" />
              ) : (
                <ChevronRight className="text-gray-400 h-5 w-5" />
              )}
            </div>
            {expandedIndex === index && (
              <p className="mt-2 text-gray-600 text-sm">{topic.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Driving;
