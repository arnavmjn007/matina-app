import React, { useState, useEffect } from 'react';
import { Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileImageActions = ({ userProfile, handleAction }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 1. New state to manage the feedback icon ('like', 'pass', or null)
  const [feedback, setFeedback] = useState(null);

  // Reset image index and feedback when the user profile changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setFeedback(null);
  }, [userProfile]);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % userProfile.profileImages.length
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + userProfile.profileImages.length) % userProfile.profileImages.length
    );
  };

  // 2. Updated function to add a delay before the transition starts
  const triggerAction = (direction) => {
    setFeedback(direction > 0 ? 'like' : 'pass');

    // Add a delay (e.g., 400 milliseconds) before calling handleAction
    // This gives the user time to see the feedback icon.
    setTimeout(() => {
      handleAction(direction);
    }, 400);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-sm mx-auto aspect-[3/4] relative">
        <div className="absolute inset-0 w-full h-full rounded-2xl shadow-lg overflow-hidden">
          {userProfile.profileImages.length > 1 && (
            <button
              onClick={goToPreviousImage}
              className="absolute top-1/2 -translate-y-1/2 left-4 z-20 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all duration-200"
            >
              <ChevronLeft className="w-8 h-8 text-gray-800" />
            </button>
          )}

          <motion.img
            key={userProfile.id + '-' + currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            src={userProfile.profileImages[currentImageIndex]}
            alt={`${userProfile.name}'s profile ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x800/CCCCCC/000000?text=Image+Not+Found"; }}
          />

          {userProfile.profileImages.length > 1 && (
            <button
              onClick={goToNextImage}
              className="absolute top-1/2 -translate-y-1/2 right-4 z-20 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all duration-200"
            >
              <ChevronRight className="w-8 h-8 text-gray-800" />
            </button>
          )}

          {/* 3. This block renders the big icon over the image when feedback is active */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
              >
                {feedback === 'like' ? (
                  <Heart size={120} className="text-pink-500 drop-shadow-lg" fill="currentColor" />
                ) : (
                  <X size={120} className="text-gray-500 drop-shadow-lg" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex space-x-8 mt-6">
        {/* 4. Buttons now call the new triggerAction function */}
        <motion.button
          onClick={() => triggerAction(-1)}
          className="bg-white p-5 rounded-full shadow-lg"
          whileTap={{ scale: 1.1 }}
        >
          <X className="text-gray-600 w-8 h-8" />
        </motion.button>

        <motion.button
          onClick={() => triggerAction(1)}
          className="bg-pink-500 p-5 rounded-full shadow-lg"
          whileTap={{ scale: 1.1 }}
        >
          <Heart className="text-white w-8 h-8" />
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileImageActions;
