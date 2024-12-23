"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const Freight = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const helpTopics = [
    { title: "Law enforcement data requests", description: "Law enforcement can submit data requests through our public safety portal. Support is available 24 hours a day. Requests for information received from authorized law enforcement authorities will be responded to according to RideWise policies, terms, and applicable laws." }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-24">
      <h1 className="text-3xl font-bold mb-6">Account & Payments</h1>
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

export default Freight;
