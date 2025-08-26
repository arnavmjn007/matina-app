// In: src/pages/Frontend/settings/ProfilePicTab.jsx

import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// Import the two services we need
import { updateUserWithImage, getUser } from '../../../services/userService';

// The component now accepts 'onUserUpdate' from its parent
const ProfilePicTab = ({ user, onUserUpdate }) => {
    const [fileList, setFileList] = React.useState([]);

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // THIS IS THE CORRECTED FUNCTION
    const handleUpdateProfilePic = async () => {
        if (fileList.length === 0) {
            message.error("Please select an image to upload.");
            return;
        }

        try {
            const file = fileList[0].originFileObj;

            // 1. Upload the new image.
            await updateUserWithImage(user.id, file);
            message.success('Profile picture updated successfully!');

            // 2. Immediately fetch the fresh user data from the server.
            const updatedUser = await getUser(user.id);

            // 3. Call the master update function to refresh the entire app.
            if (onUserUpdate) {
                onUserUpdate(updatedUser);
            }

            // 4. Clear the file list for the next upload.
            setFileList([]);

        } catch (error) {
            console.error("Failed to update profile picture:", error);
            message.error('Failed to update profile picture. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Update Profile Picture</h2>
            <div className="text-center">
                <img
                    src={user.images?.[0]?.imageUrl || "https://placehold.co/200x200?text=No+Image"}
                    alt="Current Profile"
                    className="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
                />
            </div>
            <Upload
                listType="picture"
                maxCount={1}
                fileList={fileList}
                onChange={onChange}
                beforeUpload={() => false}
            >
                <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpdateProfilePic}
                className="bg-pink-500 hover:bg-pink-600"
            >
                Save Profile Picture
            </Button>
        </div>
    );
};

export default ProfilePicTab;