import React, { useState, useEffect } from 'react';
import { Tabs, Button, message } from 'antd'; // FIX: Add 'message' to the import list
import PersonalInfoTab from './settings/PersonalInfoTab';
import BasicsTab from './settings/BasicsTab';
import PersonalityTab from './settings/PersonalityTab';
import InterestsTab from './settings/InterestsTab';
import ProfilePicTab from './settings/ProfilePicTab';
import PreviewTab from './settings/PreviewTab';
import { Modal } from 'antd';
import { deleteUser } from '../../services/userService';

const { TabPane } = Tabs;

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
                    window.location.href = '/';
                } catch (error) {
                    message.error('Failed to delete account. Please try again.');
                }
            },
        });
    };

    return (
        <Tabs defaultActiveKey="personal" type="card">
            <TabPane tab="Personal Info" key="personal">
                <PersonalInfoTab formData={formData} setFormData={setFormData} />
                <div className="mt-8 flex justify-between items-center">
                    <Button type="primary" danger onClick={handleDeleteAccount}>Delete Account</Button>
                    <Button type="primary" size="large" onClick={handleSave} className="bg-pink-500">Save Changes</Button>
                </div>
            </TabPane>

            <TabPane tab="Profile Picture" key="profilePic">
                <ProfilePicTab user={user} onUpdate={onUpdate} />
            </TabPane>

            <TabPane tab="My Basics" key="basics">
                <BasicsTab formData={formData} setFormData={setFormData} />
                <div className="mt-8 flex justify-end">
                    <Button type="primary" size="large" onClick={handleSave} className="bg-pink-500">Save Changes</Button>
                </div>
            </TabPane>

            <TabPane tab="Personality" key="personality">
                <PersonalityTab formData={formData} setFormData={setFormData} />
                <div className="mt-8 flex justify-end">
                    <Button type="primary" size="large" onClick={handleSave} className="bg-pink-500">Save Changes</Button>
                </div>
            </TabPane>

            <TabPane tab="Interests" key="interests">
                <InterestsTab formData={formData} setFormData={setFormData} />
                <div className="mt-8 flex justify-end">
                    <Button type="primary" size="large" onClick={handleSave} className="bg-pink-500">Save Changes</Button>
                </div>
            </TabPane>

            <TabPane tab="Preview" key="preview">
                <PreviewTab user={user} formData={formData} />
            </TabPane>
        </Tabs>
    );
};

export default SettingsTabs;