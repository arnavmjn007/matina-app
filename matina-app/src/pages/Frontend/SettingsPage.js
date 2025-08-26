import { useState, useEffect } from 'react';
import { message } from 'antd';
import { updateUser } from '../../services/userService';
import SettingsTabs from './SettingsTabs';

const SettingsPage = ({ user, onUserUpdate, onLogout }) => {
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
            const savedUser = await updateUser(currentUser.id, updatedData);
            message.success('Settings updated successfully!');
            setCurrentUser(savedUser);

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
            {currentUser && (
                <SettingsTabs
                    user={currentUser}
                    onUpdate={handleUpdate}
                    onUserUpdate={onUserUpdate}
                    onLogout={onLogout}
                />
            )}
        </div>
    );
};

export default SettingsPage;