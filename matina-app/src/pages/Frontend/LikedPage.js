import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// We'll reuse the same service and components
import { getAllUsers } from '../../services/userService';
import ProfileLeftPanel from '../../components/profile/ProfileLeftPanel';
import ProfileImageActions from '../../components/profile/ProfileImageActions';
import ProfileRightPanel from '../../components/profile/ProfileRightPanel';

const LikedPage = () => {
  const [likedUsers, setLikedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users who have liked you
  useEffect(() => {
    const fetchLikedUsers = async () => {
      try {
        // In a real app, this would be a different API endpoint.
        // For now, we'll just get all users to simulate the feature.
        const usersData = await getAllUsers();
        setLikedUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch liked users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedUsers();
  }, []);

  // The animation variants are the same as the DiscoveryPage
  const variants = {
    enter: { y: 300, opacity: 0, scale: 0.9 },
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (custom) => ({
      zIndex: 0,
      x: custom.direction < 0 ? -500 : 500,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3, ease: 'easeInOut' },
      boxShadow: custom.direction > 0
        ? '0 0 30px 10px rgba(236, 72, 153, 0.6)'
        : '0 0 30px 10px rgba(107, 114, 128, 0.6)',
    }),
  };

  // The handleAction logic is also the same
  const handleAction = (actionDirection) => {
    if (likedUsers.length === 0) return;
    setDirection(actionDirection);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % likedUsers.length);
    }, 150);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-xl font-semibold text-gray-500">Loading your likes...</div>;
  }

  if (!likedUsers || likedUsers.length === 0) {
    return <div className="flex items-center justify-center h-full text-xl font-semibold text-gray-500">No one has liked you yet.</div>;
  }

  const currentUser = likedUsers[currentIndex];

  return (
    <div className="h-full flex flex-col ">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Who Likes You</h1>
        <p className="text-gray-500">Here are the people who have liked your profile.</p>
        <AnimatePresence initial={false} custom={{ direction }}>
          <motion.div
            key={currentUser.id}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full h-full items-start"
            custom={{ direction }}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="lg:col-span-1 flex">
              <ProfileLeftPanel userProfile={currentUser} />
            </div>
            <div className="lg:col-span-1 flex flex-col">
              <ProfileImageActions
                userProfile={currentUser}
                handleAction={handleAction}
              />
            </div>
            <div className="lg:col-span-1 flex">
              <ProfileRightPanel userProfile={currentUser} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LikedPage;
