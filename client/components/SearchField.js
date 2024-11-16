import React, { useState, useEffect, useRef } from 'react';

export const SearchField = ({ 
  icon, 
  placeholder, 
  value, 
  onChange, 
  suggestions, 
  onSuggestionClick,
  isLoading,
  onClear 
}) => {
  const wrapperRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className={`flex items-center w-full border-2 rounded-lg px-4 py-3 bg-white transition-all duration-200 ${
          isFocused 
            ? 'border-blue-500 shadow-md' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            icon.includes('green') ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <i className={`fas ${icon} text-lg ${
              icon.includes('green') ? 'text-green-500' : 'text-red-500'
            }`}></i>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setShowSuggestions(true);
              setIsFocused(true);
            }}
            className="w-full ml-3 focus:outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          )}
          {value && (
            <button
              onClick={() => {
                onClear();
                setShowSuggestions(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
            </button>
          )}
        </div>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => {
                onSuggestionClick(suggestion);
                setShowSuggestions(false);
                setIsFocused(false);
              }}
            >
              <div className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    <i className="fas fa-map-marker-alt text-gray-500"></i>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{suggestion.text}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {suggestion.place_name.replace(suggestion.text + ', ', '')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};