import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { message } from 'antd';
import { getDiscoveryUsers, recordSwipe } from '../../services/userService';
import ProfileLeftPanel from '../../components/profile/ProfileLeftPanel';
import ProfileImageActions from '../../components/profile/ProfileImageActions';
import ProfileRightPanel from '../../components/profile/ProfileRightPanel';

const DiscoveryPage = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    const usersData = await getDiscoveryUsers(user.id);
                    setUsers(usersData);
                } catch (error) {
                    message.error("Could not load profiles.");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchUsers();
    }, [user]);

    const handleAction = async (actionType) => {
        if (currentIndex >= users.length) return;

        const swipedUser = users[currentIndex];
        const actionDirection = actionType === 'like' ? 1 : -1;
        setDirection(actionDirection);

        try {
            const result = await recordSwipe(user.id, swipedUser.id, actionType);
            if (result.isMatch) {
                message.success(`It's a Match with ${swipedUser.firstName}!`, 3);
            }
        } catch (error) {
            message.error("Something went wrong.");
        }

        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, 150);
    };

    if (isLoading) {
        return <div className="text-center font-semibold text-gray-500">Loading profiles...</div>;
    }

    if (currentIndex >= users.length) {
        return <div className="text-center font-semibold text-gray-500">No more profiles to show. Check back later!</div>;
    }

    const currentUser = users[currentIndex];
    const variants = {
        enter: { y: 300, opacity: 0, scale: 0.9 },
        center: { zIndex: 1, y: 0, opacity: 1, scale: 1, transition: { duration: 0.4 } },
        exit: (custom) => ({ zIndex: 0, x: custom.direction < 0 ? -500 : 500, opacity: 0, scale: 0.8, transition: { duration: 0.3 } }),
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
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

export default DiscoveryPage;