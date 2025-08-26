import { useState} from 'react';
import { Button, Input, Select, message } from 'antd';
import { updateUser } from '../../services/userService';
import { INTEREST_OPTIONS, WANTS_TO_OPTIONS } from '../../config/registrationConstants';

const { TextArea } = Input;
const { Option } = Select;

const SettingsPage = ({ user, onUserUpdate }) => {
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.userProfile?.bio || '',
        interests: user.interests || [],
        wantsTo: user.wantsTo || [],
        basics: user.userBasics || {},
    });

    // Handle updates for top-level fields (firstName, lastName)
    const handleTopLevelChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle updates for nested fields (bio, interests, wantsTo)
    const handleNestedChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Function to handle the form submission
    const handleSave = async () => {
        try {
            // Merge the form data with the existing user object
            const updatedUser = {
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                userProfile: {
                    ...user.userProfile,
                    bio: formData.bio,
                },
                userBasics: formData.basics,
                interests: formData.interests,
                wantsTo: formData.wantsTo
            };

            await updateUser(user.id, updatedUser);
            message.success('User updated successfully!');
            // After a successful update, refresh the user data in the parent component
            if (onUserUpdate) {
                onUserUpdate();
            }
        } catch (error) {
            console.error("Failed to save changes:", error);
            message.error('Failed to save changes. Please try again.');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

            <div className="flex flex-col space-y-6">
                {/* Basic Info Inputs */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-700">Personal Info</h2>
                    <Input
                        size="large"
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleTopLevelChange}
                    />
                    <Input
                        size="large"
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleTopLevelChange}
                    />
                </div>

                {/* Bio Input */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-700">Bio</h2>
                    <TextArea
                        rows={4}
                        placeholder="Tell us something about yourself..."
                        value={formData.bio}
                        onChange={(e) => handleNestedChange('bio', e.target.value)}
                    />
                </div>

                {/* Interests Input */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-700">Interests</h2>
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Add interests"
                        value={formData.interests}
                        onChange={(newInterests) => handleNestedChange('interests', newInterests)}
                    >
                        {INTEREST_OPTIONS.map(opt => <Option key={opt}>{opt}</Option>)}
                    </Select>
                </div>

                {/* Wants To Input */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-700">Wants To</h2>
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

                {/* Save Button */}
                <Button
                    type="primary"
                    size="large"
                    onClick={handleSave}
                    className="bg-pink-500 hover:bg-pink-600"
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default SettingsPage;