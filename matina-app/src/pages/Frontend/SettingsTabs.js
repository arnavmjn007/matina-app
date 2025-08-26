import React, { useState, useEffect } from 'react';
import { Tabs, Button, message, Modal } from 'antd';
import PersonalInfoTab from './settings/PersonalInfoTab';
import BasicsTab from './settings/BasicsTab';
import PersonalityTab from './settings/PersonalityTab';
import InterestsTab from './settings/InterestsTab';
import ProfilePicTab from './settings/ProfilePicTab';
import PreviewTab from './settings/PreviewTab';
import { deleteUser } from '../../services/userService';
import { calculatePersonalityTraits } from '../../utils/profileUtils';

const SettingsTabs = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.userProfile?.phone || '',
        address: user.userProfile?.address || '',
        bio: user.userProfile?.bio || '',
        interests: user.interests || [],
        wantsTo: user.wantsTo || [],
        basics: user.userBasics || {},
        personality: user.userPersonality || {}
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.userProfile?.phone || '',
                address: user.userProfile?.address || '',
                bio: user.userProfile?.bio || '',
                interests: user.interests || [],
                wantsTo: user.wantsTo || [],
                basics: user.userBasics || {},
                personality: user.userPersonality || {}
            });
        }
    }, [user]);

    useEffect(() => {
        const newScores = calculatePersonalityTraits(formData.personality);
        if (
            newScores.love !== formData.personality.love ||
            newScores.care !== formData.personality.care ||
            newScores.cute !== formData.personality.cute
        ) {
            setFormData(prev => ({
                ...prev,
                personality: { ...prev.personality, ...newScores }
            }));
        }
    }, [formData.personality]);

    const handleSave = () => {
        const updatedData = {
            ...user,
            firstName: formData.firstName,
            lastName: formData.lastName,
            userProfile: {
                ...user.userProfile,
                phone: formData.phone,
                address: formData.address,
                bio: formData.bio,
            },
            userBasics: formData.basics,
            userPersonality: formData.personality,
            interests: formData.interests,
            wantsTo: formData.wantsTo,
        };
        onUpdate(updatedData);
    };

    const handleDeleteAccount = () => {
        Modal.confirm({
            title: 'Are you sure you want to delete your account?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await deleteUser(user.id);
                    message.success('Account deleted successfully. Logging out...');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                } catch (error) {
                    message.error('Failed to delete account. Please try again.');
                }
            },
        });
    };

    const items = [
        {
            key: 'personal',
            label: 'Personal Info',
            children: (
                <div className="p-4 space-y-8">
                    <PersonalInfoTab formData={formData} setFormData={setFormData} />
                    <div className="flex justify-between items-center mt-4">
                        <Button type="primary" danger onClick={handleDeleteAccount}>Delete Account</Button>
                        <Button type="primary" size="large" onClick={handleSave} className="bg-pink-500">Save Changes</Button>
                    </div>
                </div>
            ),
        },
        {
            key: 'profilePic',
            label: 'Profile Picture',
            children: (
                <div className="p-4 space-y-8">
                    <ProfilePicTab user={user} onUpdate={onUpdate} />
                </div>
            ),
        },
        {
            key: 'basics',
            label: 'My Basics',
            children: (
                <div className="p-4 space-y-8">
                    <BasicsTab formData={formData} setFormData={setFormData} />
                    <div className="flex justify-end mt-4">
                        <Button type="primary" size="large" onClick={handleSave} className="bg-pink-500">Save Changes</Button>
                    </div>
                </div>
            ),
        },
        {
            key: 'personality',
            label: 'Personality',
            children: (
                <div className="p-4 space-y-8">
                    <PersonalityTab formData={formData} setFormData={setFormData} />
                    <div className="flex justify-end mt-4">
                        <Button type="primary" size="large" onClick={handleSave} className="bg-pink-500">Save Changes</Button>
                    </div>
                </div>
            ),
        },
        {
            key: 'interests',
            label: 'Interests',
            children: (
                <div className="p-4 space-y-8">
                    <InterestsTab formData={formData} setFormData={setFormData} />
                    <div className="flex justify-end mt-4">
                        <Button type="primary" size="large" onClick={handleSave} className="bg-pink-500">Save Changes</Button>
                    </div>
                </div>
            ),
        },
        {
            key: 'preview',
            label: 'Preview',
            children: (
                <div className="p-4 space-y-8">
                    <PreviewTab user={user} formData={formData} />
                </div>
            ),
        },
    ];

    return (
        <Tabs defaultActiveKey="personal" type="card" items={items} />
    );
};

export default SettingsTabs;
