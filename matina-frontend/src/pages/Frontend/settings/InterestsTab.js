import React from 'react';
import { Select } from 'antd';
// FIX: Corrected path
import { INTEREST_OPTIONS, WANTS_TO_OPTIONS } from '../../../config/registrationConstants';

const { Option } = Select;

const InterestsTab = ({ formData, setFormData }) => {
    const handleNestedChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Interests</h2>
            <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Add interests"
                value={formData.interests}
                onChange={(newInterests) => handleNestedChange('interests', newInterests)}
            >
                {INTEREST_OPTIONS.map(opt => <Option key={opt}>{opt}</Option>)}
            </Select>
            <h2 className="text-2xl font-bold mt-6">I want to...</h2>
            <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Add your intentions"
                value={formData.wantsTo}
                onChange={(newWants) => handleNestedChange('wantsTo', newWants)}
            >
                {WANTS_TO_OPTIONS.map(opt => <Option key={opt}>{opt}</Option>)}
            </Select>
        </div>
    );
};

export default InterestsTab;