import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { updateUser } from '../../services/userService';
import SettingsTabs from './SettingsTabs';

const SettingsPage = ({ user, onUserUpdate }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [user]);

    const handleUpdate = async (updatedData) => {
    try {
        // 1. Call the API and CAPTURE the saved user object it returns.
        //    Your 'updateUser' service already returns this, we just need to use it.
        const savedUser = await updateUser(currentUser.id, updatedData);
        
        message.success('Settings updated successfully!');

        // 2. UPDATE the component's local state IMMEDIATELY with the fresh data.
        //    This is the crucial step that fixes the bug. It ensures the component
        //    is always working with the most recent data from the database.
        setCurrentUser(savedUser);

        // 3. (Good Practice) Also notify the parent component about the update.
        //    If your onUserUpdate function can accept data, pass it up.
        if (onUserUpdate) {
            onUserUpdate(savedUser); 
        }

    } catch (error) {
        console.error("Failed to save changes:", error);
        message.error('Failed to save changes. Please try again.');
    }
};

    if (isLoading || !currentUser) {
        return <div className="text-center font-semibold text-gray-500">Loading settings...</div>;
    }

    return (
        <div className="flex flex-col h-auto bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
            {currentUser && <SettingsTabs user={currentUser} onUpdate={handleUpdate} />}
        </div>
    );
};

export default SettingsPage;