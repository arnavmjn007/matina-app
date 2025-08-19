import React, { useState, useEffect } from 'react';
import { Steps, Button, message } from 'antd';
import { STEPS, getBasicsItems, INITIAL_FORM_DATA } from '../../config/registrationConstants';
import { calculatePersonalityTraits } from '../../utils/profileUtils';
import { createUser } from '../../services/userService';
import BasicsEditModal from '../common/BasicsEditModal';

// Import all your individual step components
import NameStep from './NameStep';
import BirthdayStep from './BirthdayStep';
import GenderStep from './GenderStep';
import ContactStep from './ContactStep';
import PhotosStep from './PhotosStep';
import BasicsStep from './BasicsStep';
import PersonalityStep from './PersonalityStep';
import AboutStep from './AboutStep';

const ProfileSetupForm = ({ initialCredentials, onFinish }) => {
    const [current, setCurrent] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // 1. Initialize state with the new nested structure from your constants file
    const [formData, setFormData] = useState({
        ...INITIAL_FORM_DATA,
        ...initialCredentials // Merge email/password from the first step
    });

    // This effect now targets the nested personality object
    useEffect(() => {
        const newScores = calculatePersonalityTraits(formData.userPersonality);
        // Avoid infinite loops by checking if scores have changed
        if (newScores.care !== formData.userPersonality.care) {
            setFormData(prev => ({
                ...prev,
                userPersonality: { ...prev.userPersonality, ...newScores }
            }));
        }
    }, [formData.userPersonality]);

    const handleNext = () => setCurrent(current + 1);
    const handlePrev = () => setCurrent(current - 1);

    // 2. We no longer need multiple handler functions like handleBasicsChange!

    const openEditModal = (item) => {
        setEditingItem(item);
        setIsModalVisible(true);
    };

    // The save handler for the modal now cleanly updates the nested 'userBasics' state
    const handleSaveBasics = (key, value) => {
        setFormData(prev => ({
            ...prev,
            userBasics: { ...prev.userBasics, [key]: value }
        }));
    };

    const handleFinish = async () => {
        try {
            const { photos, ...userPayload } = formData;
            const imageFile = photos[0]?.originFileObj;

            if (!imageFile) {
                return message.error("Please upload at least one photo.");
            }

            await createUser(userPayload, imageFile);
            message.success('Registration Complete!');
            onFinish(); // Use the callback prop to navigate
        } catch (error) {
            console.error("Registration Error:", error);
            message.error(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    // 3. Render steps consistently with a switch statement for better readability
    const renderCurrentStep = () => {
        // All components receive the same props for consistency
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
    }

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
                        : <Button type="primary" size="large" className="bg-green-500" onClick={handleFinish}>Finish</Button>
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