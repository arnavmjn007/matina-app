import React, { useState, useEffect } from 'react';
import { Steps, Button, message } from 'antd';
import { STEPS, getBasicsItems, INITIAL_FORM_DATA } from '../../config/registrationConstants';
import { calculatePersonalityTraits } from '../../utils/profileUtils';
import { createUser } from '../../services/userService';
import BasicsEditModal from '../common/BasicsEditModal';
import NameStep from './NameStep';
import BirthdayStep from './BirthdayStep';
import GenderStep from './GenderStep';
import ContactStep from './ContactStep';
import PhotosStep from './PhotosStep';
import BasicsStep from './BasicsStep';
import PersonalityStep from './PersonalityStep';
import AboutStep from './AboutStep';
import dayjs from 'dayjs';

// --- THIS IS THE FIX ---
// 1. The prop is now named 'initialUserData' to match what Register.jsx is sending.
const ProfileSetupForm = ({ initialUserData, onFinish }) => {
    const [current, setCurrent] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        ...INITIAL_FORM_DATA,
        // 2. Use the correctly named prop here to set the email and password.
        ...initialUserData
    });

    // This effect calculates personality scores and does not need changes.
    useEffect(() => {
        const newScores = calculatePersonalityTraits(formData.userPersonality);
        if (
            newScores.love !== formData.userPersonality.love ||
            newScores.care !== formData.userPersonality.care ||
            newScores.cute !== formData.userPersonality.cute
        ) {
            setFormData(prev => ({
                ...prev,
                userPersonality: { ...prev.userPersonality, ...newScores }
            }));
        }
    }, [formData.userPersonality]);

    const handleNext = () => setCurrent(current + 1);
    const handlePrev = () => setCurrent(current - 1);

    const openEditModal = (item) => {
        setEditingItem(item);
        setIsModalVisible(true);
    };

    const handleSaveBasics = (key, value) => {
        setFormData(prev => ({
            ...prev,
            userBasics: { ...prev.userBasics, [key]: value }
        }));
    };

    const handleFinish = async () => {
        setIsSaving(true);
        try {
            const imageFiles = formData.photos.map(file => file.originFileObj);

            if (imageFiles.length === 0) {
                message.error("Please upload at least one photo.");
                setIsSaving(false);
                return;
            }

            const userPayload = { ...formData };
            delete userPayload.photos;

            // Correctly format the birthday before sending to the backend
            if (userPayload.userProfile && userPayload.userProfile.birthday && dayjs.isDayjs(userPayload.userProfile.birthday)) {
                userPayload.userProfile.birthday = userPayload.userProfile.birthday.format('YYYY-MM-DD');
            } else if (userPayload.userProfile) {
                userPayload.userProfile.birthday = null;
            }

            await createUser(userPayload, imageFiles);

            message.success('Registration Complete! Please log in.');

            // 3. This now works because 'onFinish' is being passed correctly from Register.jsx
            if (onFinish) {
                onFinish();
            }
        } catch (error) {
            console.error("Registration failed:", error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            message.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const renderCurrentStep = () => {
        const props = { data: formData, setFormData };
        switch (current) {
            case 0: return <NameStep {...props} />;
            case 1: return <BirthdayStep {...props} />;
            case 2: return <GenderStep {...props} />;
            case 3: return <ContactStep {...props} />;
            case 4: return <PhotosStep {...props} />;
            case 5: return <BasicsStep basicsItems={getBasicsItems(formData.userBasics)} openEditModal={openEditModal} />;
            case 6: return <PersonalityStep {...props} />;
            case 7: return <AboutStep {...props} />;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden min-h-[70vh]">
            <div className="w-full md:w-1/3 p-8 bg-gray-50 border-r">
                <h2 className="text-2xl font-bold mb-6 text-pink-500">Create Profile</h2>
                <Steps direction="vertical" current={current} items={STEPS} />
            </div>
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-between">
                <div>{renderCurrentStep()}</div>
                <div className="mt-8 flex justify-between">
                    {current > 0 && <Button size="large" onClick={handlePrev}>Back</Button>}
                    {current < STEPS.length - 1
                        ? <Button type="primary" size="large" onClick={handleNext} className="bg-pink-500">Next</Button>
                        : <Button type="primary" size="large" className="bg-green-500" onClick={handleFinish} loading={isSaving}>Finish</Button>
                    }
                </div>
            </div>
            <BasicsEditModal
                isOpen={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                item={editingItem}
                onSave={handleSaveBasics}
            />
        </div>
    );
};

export default ProfileSetupForm;