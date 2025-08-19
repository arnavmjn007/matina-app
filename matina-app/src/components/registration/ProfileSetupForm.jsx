import React, { useState, useEffect } from 'react';
import { Steps, Button, message } from 'antd';
import { STEPS, getBasicsItems } from '../../config/registrationConstants';
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

const ProfileSetupForm = ({ navigateTo }) => {
    const [current, setCurrent] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', birthday: null, gender: '', photos: [], address: '', phone: '',
        interestedIn: 'Women', interests: [], wantsTo: [], bio: '',
        love: 50, care: 50, cute: 50,
        basics: {
            height: "170 cm", exercise: "Sometimes", education: "Undergraduate", drinking: "Socially",
            smoking: "Never", lookingFor: "Relationship", kids: "Don't want", starSign: "Pisces", politics: "Apolitical", religion: "Buddhist"
        },
        personality: { q1_care: null, q2_love: null, q3_cute: null }
    });

    useEffect(() => {
        const newScores = calculatePersonalityTraits(formData.personality);
        setFormData(prev => ({ ...prev, ...newScores }));
    }, [formData.personality]);

    const handleNext = () => setCurrent(current + 1);
    const handlePrev = () => setCurrent(current - 1);

    // Generic handler for most form inputs
    // const handleFormChange = (key, value) => {
    //     setFormData(prev => ({ ...prev, [key]: value }));
    // };

    const handleBasicsChange = (key, value) => setFormData({ ...formData, basics: { ...formData.basics, [key]: value } });
    const handlePersonalityChange = (key, value) => setFormData({ ...formData, personality: { ...formData.personality, [key]: value } });

    const openEditModal = (item) => {
        setEditingItem(item);
        setIsModalVisible(true);
    };

    const handleFinish = async () => {
        try {
            // 2. Uncomment this block
            const imageFile = formData.photos[0]?.originFileObj;
            if (!imageFile) {
                return message.error("Please upload at least one photo.");
            }

            const userPayload = { ...formData };
            delete userPayload.photos; // We send the file separately

            // This is where you call the function to send data to the backend
            await createUser(userPayload, imageFile);

            message.success('Registration Complete!');
            navigateTo('login'); // Navigate to login after success
        } catch (error) {
            message.error('Registration failed. Please try again.');
        }
    };

    const basicsItems = getBasicsItems(formData.basics);

    const stepContent = [
        <NameStep data={formData} setFormData={setFormData} />,
        <BirthdayStep data={formData} setFormData={setFormData} />,
        <GenderStep data={formData} setFormData={setFormData} />,
        <ContactStep data={formData} setFormData={setFormData} />,
        <PhotosStep setFormData={setFormData} />,
        <BasicsStep basicsItems={basicsItems} openEditModal={openEditModal} />,
        <PersonalityStep data={formData.personality} handlePersonalityChange={handlePersonalityChange} />,
        <AboutStep data={formData} setFormData={setFormData} />
    ];

    return (
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden min-h-[70vh]">
            <div className="w-full md:w-1/3 p-8 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-pink-500">Create Account</h2>
                <Steps direction="vertical" current={current} items={STEPS} />
            </div>
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-between">
                <div>{stepContent[current]}</div>
                <div className="mt-8 flex justify-between">
                    {current > 0 && <Button size="large" onClick={handlePrev}>Back</Button>}
                    {current < STEPS.length - 1
                        ? <Button type="primary" size="large" onClick={handleNext} className="bg-pink-500 hover:bg-pink-600 border-pink-500">Next</Button>
                        : <Button type="primary" size="large" className="bg-green-500 hover:bg-green-600 border-green-500" onClick={handleFinish}>Finish</Button>
                    }
                </div>
            </div>
            <BasicsEditModal isOpen={isModalVisible} onCancel={() => setIsModalVisible(false)} item={editingItem} onSave={handleBasicsChange} />
        </div>
    );
};

export default ProfileSetupForm;
