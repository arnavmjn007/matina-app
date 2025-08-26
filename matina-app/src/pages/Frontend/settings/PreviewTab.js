import React from 'react';
import ProfileLeftPanel from '../../../components/profile/ProfileLeftPanel';
import ProfileRightPanel from '../../../components/profile/ProfileRightPanel';
import ProfileImageActions from '../../../components/profile/ProfileImageActions';

const PreviewTab = ({ user, formData }) => {
    // Merge existing user data with temporary form data
    const previewUser = {
        ...user,
        ...formData,
        userProfile: {
            ...user.userProfile,
            phone: formData.phone,
            address: formData.address,
            bio: formData.bio,
        },
        userBasics: formData.basics,
        userPersonality: formData.personality
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full h-full items-start">
            <div className="lg:col-span-1"><ProfileLeftPanel userProfile={previewUser} /></div>
            <div className="lg:col-span-1"><ProfileImageActions userProfile={previewUser} handleAction={() => { }} /></div>
            <div className="lg:col-span-1"><ProfileRightPanel userProfile={previewUser} /></div>
        </div>
    );
};

export default PreviewTab;