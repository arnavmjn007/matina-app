import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { message } from "antd";

import {
  getDiscoveryUsers,
  getGuestDiscoveryUsers,
  recordSwipe,
} from "../../services/userService";

import ProfileLeftPanel from "../../components/profile/ProfileLeftPanel";
import ProfileImageActions from "../../components/profile/ProfileImageActions";
import ProfileRightPanel from "../../components/profile/ProfileRightPanel";

const DiscoveryPage = ({ user, onRequireAuth }) => {
  const isGuest = !user;

  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = user
          ? await getDiscoveryUsers(user.id)
          : await getGuestDiscoveryUsers();

        if (!alive) return;
        setUsers(usersData || []);
        setCurrentIndex(0);
      } catch (e) {
        if (!alive) return;
        message.error("Could not load profiles.");
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    };

    fetchUsers();
    return () => {
      alive = false;
    };
  }, [user]);

  const handleAction = async (actionType) => {
    // Guest cannot swipe
    if (isGuest) {
      message.info("Login to like/dislike and chat.");
      onRequireAuth?.();
      return;
    }

    if (currentIndex >= users.length) return;

    const swipedUser = users[currentIndex];
    const actionDirection = actionType === "like" ? 1 : -1;
    setDirection(actionDirection);

    try {
      const result = await recordSwipe(user.id, swipedUser.id, actionType);
      if (result?.isMatch) {
        message.success(`It's a Match with ${swipedUser.firstName}!`, 3);
      }
    } catch (error) {
      message.error("Something went wrong.");
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="text-center font-semibold text-gray-500">
        Loading profiles...
      </div>
    );
  }

  if (users.length === 0 || currentIndex >= users.length) {
    return (
      <div className="text-center font-semibold text-gray-500">
        No more profiles to show. Check back later!
      </div>
    );
  }

  const currentUser = users[currentIndex];

  const variants = {
    enter: { y: 300, opacity: 0, scale: 0.9 },
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    exit: (custom) => ({
      zIndex: 0,
      x: custom.direction < 0 ? -500 : 500,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <div className="h-full">
      <AnimatePresence initial={false} custom={{ direction }}>
        <motion.div
          key={currentUser.id}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch"
          custom={{ direction }}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <div className="h-full">
            <ProfileLeftPanel userProfile={currentUser} />
          </div>

          <div className="h-full">
            <ProfileImageActions
              userProfile={currentUser}
              handleAction={handleAction}
              isGuest={isGuest}
              onRequireAuth={onRequireAuth}
            />
          </div>

          <div className="h-full">
            <ProfileRightPanel
              userProfile={currentUser}
              isGuest={isGuest}
              onRequireAuth={onRequireAuth}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DiscoveryPage;
