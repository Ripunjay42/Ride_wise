import React from 'react';
import { Check, X, Clock } from 'lucide-react';

const StatusProgressBar = ({ status }) => {
  const getStepsConfig = () => {
    const baseSteps = [
      { label: 'Created', complete: true },
      { label: 'Active', complete: status !== 'created' },
      { label: 'Busy', complete: status === 'busy' || status === 'completed' },
      { label: 'Completed', complete: status === 'completed' }
    ];

    if (status === 'cancelled') {
      return baseSteps.map((step, index) => ({
        ...step,
        complete: index === 0,
        cancelled: index === 1
      }));
    }

    return baseSteps;
  };

  const steps = getStepsConfig();

  return (
    <div className="relative max-w-md mx-auto">
      {/* Background Line */}
      <div
        className="absolute top-4 left-0 h-0.5 w-full bg-gray-200"
        aria-hidden="true"
      />

      {/* Active/Progress Line */}
      <div
        className="absolute top-4 left-0 h-0.5 bg-green-600 transition-all duration-500"
        style={{
          width: `${(steps.filter(step => step.complete).length - 1) / (steps.length - 1) * 100}%`
        }}
      />

      {/* Steps */}
      <div className="relative flex justify-between items-center px-2">
        {steps.map((step, index) => {
          const getStepStyles = () => {
            if (step.cancelled) {
              return 'border-red-500 bg-red-500';
            }
            if (step.complete) {
              return 'border-green-600 bg-green-600';
            }
            if (status === 'busy' && step.label === 'Busy') {
              return 'border-yellow-500 bg-yellow-500';
            }
            return 'border-gray-300 bg-white';
          };

          const getLabelStyles = () => {
            if (step.cancelled) {
              return 'text-red-500 font-medium';
            }
            if (step.complete) {
              return 'text-green-600 font-medium';
            }
            if (status === 'busy' && step.label === 'Busy') {
              return 'text-yellow-600 font-medium';
            }
            return 'text-gray-500';
          };

          const getStepIcon = () => {
            if (step.complete && !step.cancelled) {
              return <Check className="w-4 h-4 text-white" />;
            }
            if (step.cancelled) {
              return <X className="w-4 h-4 text-white" />;
            }
            if (status === 'busy' && step.label === 'Busy') {
              return <Clock className="w-4 h-4 text-white" />;
            }
            return null;
          };

          return (
            <div key={step.label} className="flex flex-col items-center w-20">
              <div 
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${getStepStyles()}`}
              >
                {getStepIcon()}
              </div>
              <div className={`mt-2 text-sm ${getLabelStyles()} text-center`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusProgressBar;