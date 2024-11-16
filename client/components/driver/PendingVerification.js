import React from 'react';
import { Card, CardContent, CardHeader } from '../Card';
import { Shield, Clock, CheckCircle, Mail, RefreshCcw } from 'lucide-react';

export const PendingVerification = () => {
  return (
    <div className="max-w-3xl mx-auto mt-20 px-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-50 to-blue-50 -z-10" />
      
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-yellow-100 rounded-full opacity-50 animate-pulse" />
        <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-blue-100 rounded-full opacity-50 animate-pulse delay-300" />
        
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-t-4 border-t-yellow-400 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-gray-100 opacity-5" />
          
          <CardHeader className="text-center pb-2 relative">
            <div className="animate-bounce-slow">
              <div className="relative">
                <div className="absolute inset-0 animate-ping">
                  <Shield className="w-16 h-16 mx-auto text-yellow-400/30" />
                </div>
                <Shield className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
              Account Verification Pending
            </h1>
          </CardHeader>

          <CardContent>
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
                <p className="relative bg-white rounded-lg p-4 text-gray-600 text-center text-lg leading-relaxed">
                  Your driver account is currently under review. This process helps ensure the safety and quality of our service.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-xl shadow-inner">
                <h2 className="font-semibold text-gray-800 mb-6 flex items-center text-xl">
                  <div className="animate-spin-slow">
                    <Clock className="w-6 h-6 mr-3 text-yellow-500" />
                  </div>
                  What to expect:
                </h2>
                <ul className="space-y-4">
                  {[
                    'Our team is reviewing your submitted documents',
                    'Verification usually takes 1-2 business days',
                    "You'll receive an email once your account is verified"
                  ].map((text, index) => (
                    <li key={index} className="flex items-start transform hover:translate-x-2 transition-transform duration-300">
                      <div className="flex-shrink-0 p-1 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="ml-3 text-gray-700">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform skew-y-0 -rotate-3 rounded-3xl" />
                <div className="relative bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <p className="font-medium">Need help? Contact our support team</p>
                    </div>
                    <a 
                      href="mailto:contactridewise@gmail.com" 
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      contactridewise@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Loading indicator */}
          <div className="absolute bottom-4 right-4">
            <RefreshCcw className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        </Card>
      </div>
    </div>
  );
};

// Add this to your global CSS
const style = `
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-spin-slow {
  animation: spin-slow 6s linear infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

.bg-grid-gray-100 {
  background-image: linear-gradient(to right, #f3f4f6 1px, transparent 1px),
    linear-gradient(to bottom, #f3f4f6 1px, transparent 1px);
  background-size: 20px 20px;
}
`;

export default PendingVerification;