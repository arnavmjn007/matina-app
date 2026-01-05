import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Import the correct functions
import { getLikedUsers, recordSwipe } from '../../services/userService';
import ProfileLeftPanel from '../../components/profile/ProfileLeftPanel';
import ProfileImageActions from '../../components/profile/ProfileImageActions';
import ProfileRightPanel from '../../components/profile/ProfileRightPanel';
import { message } from 'antd';

const LikedPage = ({ user }) => {
    const [likedUsers, setLikedUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLikedUsers = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    // FIX: Call the correct function with the user's ID
                    const usersData = await getLikedUsers(user.id);
                    setLikedUsers(usersData);
                } catch (error) {
                    console.error("Failed to fetch liked users:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchLikedUsers();
    }, [user]);

    const handleAction = async (actionType) => {
        if (currentIndex >= likedUsers.length) return;

        const swipedUser = likedUsers[currentIndex];
        const actionDirection = actionType === 'like' ? 1 : -1;
        setDirection(actionDirection);

        try {
            const result = await recordSwipe(user.id, swipedUser.id, actionType);
            if (result.isMatch) {
                message.success(`You matched with ${swipedUser.firstName}!`);
            }
        } catch (error) {
            message.error("Action failed.");
        }

        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, 150);
    };

    if (isLoading) {
        return <div className="text-center font-semibold text-gray-500">Loading your likes...</div>;
    }

    if (currentIndex >= likedUsers.length) {
        return <div className="text-center font-semibold text-gray-500">No one new has liked you yet.</div>;
    }

    const currentUser = likedUsers[currentIndex];
    const variants = { /* ... same variants as DiscoveryPage ... */ };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Who Likes You</h1>
                <p className="text-gray-500">Here are the people who have liked your profile.</p>
            </div>
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
                    <div className="lg:col-span-1"><ProfileLeftPanel userProfile={currentUser} /></div>
                    <div className="lg:col-span-1"><ProfileImageActions userProfile={currentUser} handleAction={handleAction} /></div>
                    <div className="lg:col-span-1"><ProfileRightPanel userProfile={currentUser} /></div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default LikedPage;