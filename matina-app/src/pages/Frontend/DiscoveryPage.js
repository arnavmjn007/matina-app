import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Import the service to fetch user data
import { getAllUsers } from '../../services/userService';

// 2. Import the profile components
import ProfileLeftPanel from '../../components/profile/ProfileLeftPanel';
import ProfileImageActions from '../../components/profile/ProfileImageActions';
import ProfileRightPanel from '../../components/profile/ProfileRightPanel';

const DiscoveryPage = () => {
  // 3. State management for users, loading status, and animation
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 0: initial, 1: like, -1: pass
  const [isLoading, setIsLoading] = useState(true);

  // 4. Fetch users from the API when the component first loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        // Handle error state if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []); // The empty array ensures this runs only once on mount

  // 5. Animation variants for the main profile container
  const variants = {
    enter: {
      y: 300,
      opacity: 0,
      scale: 0.9,
    },
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (custom) => ({
      zIndex: 0,
      x: custom.direction < 0 ? -500 : 500, // Exit left for pass, right for like
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3, ease: 'easeInOut' },
      // Add a color glow effect on exit using box-shadow
      boxShadow: custom.direction > 0
        ? '0 0 30px 10px rgba(236, 72, 153, 0.6)' // Pink glow for 'like'
        : '0 0 30px 10px rgba(107, 114, 128, 0.6)', // Gray glow for 'pass'
    }),
  };

  // 6. Function to handle the like/pass action
  const handleAction = (actionDirection) => {
    setDirection(actionDirection);
    // Use a short delay to allow the exit animation to start before the next user appears
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
    }, 150);
  };

  // 7. Conditional rendering for loading and empty states
  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-xl font-semibold text-gray-500">Loading profiles...</div>;
  }

  if (!users || users.length === 0) {
    return <div className="flex items-center justify-center h-full text-xl font-semibold text-gray-500">No more profiles to show.</div>;
  }

  const currentUser = users[currentIndex];

  return (
    <div className="h-full flex flex-col overflow-hidden ">
      <AnimatePresence initial={false} custom={{ direction }}>
        <motion.div
          key={currentUser.id}
          // The grid now uses items-start to prevent vertical stretching on large screens
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full h-full items-start"
          custom={{ direction }}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {/* Left Column */}
          <div className="lg:col-span-1 flex">
            <ProfileLeftPanel userProfile={currentUser} />
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-1 flex flex-col">
            <ProfileImageActions
              userProfile={currentUser}
              handleAction={handleAction}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 flex">
            <ProfileRightPanel userProfile={currentUser} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default DiscoveryPage;
