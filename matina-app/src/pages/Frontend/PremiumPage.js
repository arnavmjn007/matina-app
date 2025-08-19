import React from 'react';
import { Star, Heart, Zap, CheckCircle } from 'lucide-react';

const PremiumPage = ({ navigateTo }) => {
  const premiumFeatures = [
    { icon: <Heart className="text-pink-400" />, text: "See everyone who likes you" },
    { icon: <Zap className="text-yellow-400" />, text: "Spotlight your profile once a month" },
    { icon: <CheckCircle className="text-green-400" />, text: "Unlimited likes and rewinds" },
    { icon: <Star className="text-blue-400" />, text: "Stand out with Super Likes" },
  ];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 text-white rounded-3xl shadow-2xl text-center">
        <div className="flex flex-col items-center">
          <Star className="w-16 h-16 text-yellow-400 mb-4" fill="currentColor" />
          <h1 className="text-4xl font-bold font-display">Matina Gold</h1>
          <p className="mt-2 text-gray-400">Unlock your full dating potential.</p>
        </div>

        <div className="space-y-4 text-left">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0">{feature.icon}</div>
              <span className="text-lg">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-4">
           <button className="w-full py-4 text-lg font-bold text-gray-900 bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-transform transform hover:scale-105">
            Upgrade Now - $9.99/mo
          </button>
          <button 
            onClick={() => navigateTo('discovery')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
