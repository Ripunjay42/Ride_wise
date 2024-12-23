"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const Driving = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const helpTopics = [
    { title: "RideWise driver guide", description: "You may be charged a cancellation fee if you cancel a trip after you’re matched with a driver. These fees pay driver-partners for the time and effort they spend getting to your location. Drivers are also able to cancel a ride request if they’ve waited a certain amount of time at the pickup location. You may be charged a cancellation fee, in this case, to reimburse your driver for their time. Note: We periodically experiment with changes to the cancellation policy. As a result, cancellation fees may be waived for a small subset of randomly selected cancellations." },
    { title: "Driving with RideWise", description: "Request a review of your fare if you think there was an error." },
    { title: "Can I use a rental car to drive", description: "Get help with issues related to cash payments for trips." },
    { title: "RideWise vechicle requirements", description: "Find support for payment methods and troubleshooting." },
    { title: "How much data does the driver app use?", description: "Contact the driver to retrieve lost items or learn more about lost item policies." },
    { title: "Uploading documents in the RideWise app with your phone", description: "Report any issues with delivery or delays." }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-24">
      <h1 className="text-3xl font-bold mb-6">Support Resources for Drivers & Deliveries</h1>
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
