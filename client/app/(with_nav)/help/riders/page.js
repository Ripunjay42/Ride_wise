"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const Riders = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const helpTopics = [
    { title: "Cancellations", description: "You may be charged a cancellation fee if you cancel a trip after you’re matched with a driver. These fees pay driver-partners for the time and effort they spend getting to your location. Drivers are also able to cancel a ride request if they’ve waited a certain amount of time at the pickup location. You may be charged a cancellation fee, in this case, to reimburse your driver for their time. Note: We periodically experiment with changes to the cancellation policy. As a result, cancellation fees may be waived for a small subset of randomly selected cancellations." },
    { title: "Fare review", description: "Request a review of your fare if you think there was an error." },
    { title: "Cash payment issues", description: "Get help with issues related to cash payments for trips." },
    { title: "Other payment support", description: "Find support for payment methods and troubleshooting." },
    { title: "Lost item", description: "Contact the driver to retrieve lost items or learn more about lost item policies." },
    { title: "Delivery issues", description: "Report any issues with delivery or delays." },
    { title: "Feedback about the driver or vehicle", description: "Share feedback about your driver or vehicle." },
    { title: "Safety", description: "Access safety resources and report safety-related issues." }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-24">
      <h1 className="text-3xl font-bold mb-6">Support Resources for RideWise Riders</h1>
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

export default Riders;
