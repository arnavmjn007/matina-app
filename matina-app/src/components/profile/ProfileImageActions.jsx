import { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileImageActions = ({ userProfile, handleAction }) => {
  const [feedback, setFeedback] = useState(null);

  // Reset feedback animation when the user profile changes
  useEffect(() => {
    setFeedback(null);
  }, [userProfile]);

  // This function shows the like/dislike icon, then calls the parent function
  const triggerAction = (actionType) => { // actionType will be 'like' or 'dislike'
    setFeedback(actionType);
    setTimeout(() => {
      handleAction(actionType);
    }, 400); // 400ms delay to show the feedback icon
  };

  // Get the single image URL from the correct nested object
  const imageUrl = userProfile?.userProfile?.profileImageUrl;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-sm mx-auto aspect-[3/4] relative">
        <div className="absolute inset-0 w-full h-full rounded-2xl shadow-lg overflow-hidden">
          <motion.img
            key={userProfile.id} // Animate when the user changes
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            src={imageUrl}
            alt={`${userProfile.firstName}'s profile`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://placehold.co/600x800/CCCCCC/FFFFFF?text=Image+Not+Found"; }}
          />
          {/* Feedback Icon Animation */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
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
      {/* Action Buttons */}
      <div className="flex space-x-8 mt-6">
        <motion.button onClick={() => triggerAction('dislike')} className="bg-white p-5 rounded-full shadow-lg" whileTap={{ scale: 1.1 }}>
          <X className="text-gray-600 w-8 h-8" />
        </motion.button>
        <motion.button onClick={() => triggerAction('like')} className="bg-pink-500 p-5 rounded-full shadow-lg" whileTap={{ scale: 1.1 }}>
          <Heart className="text-white w-8 h-8" fill="currentColor" />
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileImageActions;