import React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

const PersonalInfoTab = ({ formData, setFormData }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Account Details</h2>
            <Input size="large" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" />
            <Input size="large" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" />
            <Input size="large" name="email" value={formData.email} disabled placeholder="Email Address" />
            <Input size="large" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" />
            <Input size="large" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" />
            <TextArea rows={4} placeholder="Your Bio" value={formData.bio} onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))} />
        </div>
    );
};

export default PersonalInfoTab;