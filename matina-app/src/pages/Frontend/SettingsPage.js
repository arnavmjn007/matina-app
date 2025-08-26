import { useState, useEffect } from 'react';
import {
    User, Settings as SettingsIcon, Trash2, Eye, Mail, Phone
} from 'lucide-react';
import {
    Button, Input,Collapse, message, Modal, Form
} from 'antd';
import 'antd/dist/reset.css';
// Import all necessary functions, including the new ones
import { updateUser, deleteUser, updatePassword } from '../../services/userService';
import ProfileLeftPanel from '../../components/profile/ProfileLeftPanel';
import ProfileRightPanel from '../../components/profile/ProfileRightPanel';

const { Panel } = Collapse;
const { TextArea } = Input;

// Profile Preview Modal Component
const ProfilePreviewModal = ({ isOpen, onCancel, userProfile }) => (
    <Modal open={isOpen} onCancel={onCancel} footer={null} width={1000} centered>
        <div className="p-4 bg-gray-100">
            <h2 className="text-2xl font-bold text-center mb-4">Profile Preview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <ProfileLeftPanel userProfile={userProfile} />
                <ProfileRightPanel userProfile={userProfile} />
            </div>
        </div>
    </Modal>
);

const SettingsPage = ({ onLogout }) => {
    const [activeUser, setActiveUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setActiveUser(JSON.parse(storedUser));
        }
    }, []);

    const handleStateChange = (section, key, value) => {
        setActiveUser(prev => ({
            ...prev,
            [section]: { ...prev[section], [key]: value }
        }));
    };

    const handleTopLevelChange = (key, value) => {
        setActiveUser(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const updatedUser = await updateUser(activeUser.id, activeUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            message.success("Profile saved successfully!");
        } catch (error) {
            message.error("Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = () => {
        Modal.confirm({
            title: 'Are you sure you want to delete your account?',
            content: 'This action is permanent and cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteUser(activeUser.id);
                    message.success('Account deleted successfully.');
                    onLogout();
                } catch (error) {
                    message.error('Failed to delete account.');
                }
            },
        });
    };

    const handlePasswordChange = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            return message.error("Passwords do not match!");
        }
        try {
            await updatePassword(activeUser.id, values.newPassword);
            message.success("Password updated successfully!");
            form.resetFields();
        } catch (error) {
            message.error("Failed to update password.");
        }
    };

    if (!activeUser) {
        return <div className="text-center">Loading settings...</div>;
    }

    const panelHeader = (title, icon) => (
        <div className="flex items-center space-x-3 text-lg font-semibold">{icon}{title}</div>
    );

    return (
        <>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
                </div>

                <Collapse defaultActiveKey={['1']} accordion className="bg-white rounded-lg shadow-sm border-none">
                    <Panel header={panelHeader("Edit Profile", <User className="text-pink-500" />)} key="1">
                        <div className="space-y-6 p-4">
                            <div>
                                <label className="block font-semibold mb-2">First Name</label>
                                <Input value={activeUser.firstName} onChange={(e) => handleTopLevelChange('firstName', e.target.value)} />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">Last Name</label>
                                <Input value={activeUser.lastName} onChange={(e) => handleTopLevelChange('lastName', e.target.value)} />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">About Me (Bio)</label>
                                <TextArea rows={4} value={activeUser.userProfile.bio} onChange={(e) => handleStateChange('userProfile', 'bio', e.target.value)} />
                            </div>
                        </div>
                    </Panel>

                    <Panel header={panelHeader("Account Settings", <SettingsIcon className="text-pink-500" />)} key="2">
                        <div className="space-y-6 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center"><Mail className="w-5 h-5 mr-3" /><span>Email Address</span></div>
                                <span className="font-semibold">{activeUser.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center"><Phone className="w-5 h-5 mr-3" /><span>Phone Number</span></div>
                                <Input value={activeUser.userProfile.phone} onChange={(e) => handleStateChange('userProfile', 'phone', e.target.value)} style={{ width: '200px' }} />
                            </div>
                            <hr />
                            <h3 className="font-semibold text-gray-700">Change Password</h3>
                            <Form form={form} onFinish={handlePasswordChange} layout="vertical">
                                <Form.Item name="newPassword" label="New Password" rules={[{ required: true }]}>
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item name="confirmPassword" label="Confirm New Password" rules={[{ required: true }]}>
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Update Password</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Panel>
                </Collapse>

                <div className="flex flex-wrap gap-4 pt-8">
                    <Button type="primary" size="large" onClick={handleSaveChanges} loading={isSaving} className="bg-pink-500">
                        Save All Changes
                    </Button>
                    <Button size="large" icon={<Eye size={16} className="mr-2" />} onClick={() => setIsPreviewVisible(true)}>
                        Preview Profile
                    </Button>
                    <Button size="large" danger icon={<Trash2 size={16} className="mr-2" />} onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </div>
            </div>

            <ProfilePreviewModal
                isOpen={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                userProfile={activeUser}
            />
        </>
    );
};

export default SettingsPage;
