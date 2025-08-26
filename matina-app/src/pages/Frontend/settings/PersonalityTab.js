import React, { useEffect } from 'react';
import { Radio } from 'antd';
// FIX: Corrected path
import { calculatePersonalityTraits } from '../../../utils/profileUtils';

const PersonalityTab = ({ formData, setFormData }) => {

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
    }, [formData.personality, setFormData]);

    const handlePersonalityChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            personality: { ...prev.personality, [key]: value }
        }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Personality Quiz</h2>
            <div>
                <label className="font-semibold text-gray-700">Your partner is having a bad day. What do you do?</label>
                <Radio.Group value={formData.personality.q1_care} onChange={(e) => handlePersonalityChange('q1_care', e.target.value)} className="mt-2 flex flex-col space-y-2">
                    <Radio value="Listen and support">Listen and support</Radio>
                    <Radio value="Try to cheer them up">Try to cheer them up</Radio>
                    <Radio value="Give them space">Give them space</Radio>
                </Radio.Group>
            </div>
            <div>
                <label className="font-semibold text-gray-700">What's your ideal romantic evening?</label>
                <Radio.Group value={formData.personality.q2_love} onChange={(e) => handlePersonalityChange('q2_love', e.target.value)} className="mt-2 flex flex-col space-y-2">
                    <Radio value="A fancy, planned dinner">A fancy, planned dinner</Radio>
                    <Radio value="A spontaneous adventure">A spontaneous adventure</Radio>
                    <Radio value="Chilling at home">Chilling at home</Radio>
                </Radio.Group>
            </div>
            <div>
                <label className="font-semibold text-gray-700">What's your sense of humor like?</label>
                <Radio.Group value={formData.personality.q3_cute} onChange={(e) => handlePersonalityChange('q3_cute', e.target.value)} className="mt-2 flex flex-col space-y-2">
                    <Radio value="Goofy and playful">Goofy and playful</Radio>
                    <Radio value="Sarcastic and witty">Sarcastic and witty</Radio>
                    <Radio value="I am more serious">I am more serious</Radio>
                </Radio.Group>
            </div>
        </div>
    );
};

export default PersonalityTab;