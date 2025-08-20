import { useState, useEffect } from 'react';
import {
    User, Settings as SettingsIcon, Plus, Phone, Mail, Ruler, Dumbbell,
    GraduationCap, GlassWater, Cigarette, Heart, Baby, Sparkles, Landmark, Church
} from 'lucide-react';
import {
    Button, Input, Select, Collapse, message, Modal, Slider, Radio
} from 'antd';
import 'antd/dist/reset.css';
import { updateUser } from '../../services/userService';

const { Panel } = Collapse;
const { TextArea } = Input;

// Reusable Modal for Editing Basics (included for completeness)
const BasicsEditModal = ({ isOpen, onCancel, item, onSave }) => {
    const [currentValue, setCurrentValue] = useState(item?.value);

    useEffect(() => {
        setCurrentValue(item?.value);
    }, [item]);

    const renderInput = () => {
        if (!item) return null;
        if (item.type === 'height') {
            const numValue = parseInt(currentValue) || 170;
            return (
                <>
                    <div className="text-center text-2xl font-bold mb-4">{currentValue || `${numValue} cm`}</div>
                    <Slider min={120} max={220} value={numValue} onChange={(val) => setCurrentValue(`${val} cm`)} />
                </>
            );
        }
        if (item.type === 'radio') {
            return (
                <Radio.Group onChange={(e) => setCurrentValue(e.target.value)} value={currentValue} className="flex flex-col space-y-3">
                    {item.options.map(opt => <Radio.Button key={opt} value={opt} className="rounded-full h-12 flex items-center justify-center">{opt}</Radio.Button>)}
                </Radio.Group>
            );
        }
        return <Input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />;
    };

    const handleSave = () => {
        onSave(item.key, currentValue);
        onCancel();
    };

    return (
        <Modal open={isOpen} onCancel={onCancel} centered footer={null} width={400}>
            <div className="p-6 text-center">
                <div className="flex justify-center text-yellow-500 mb-4">{item?.icon}</div>
                <h2 className="text-2xl font-bold mb-6">What is your {item?.label.toLowerCase()}?</h2>
                {renderInput()}
                <div className="mt-8">
                    <Button type="primary" size="large" block onClick={handleSave} className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-black font-bold">
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
};


const SettingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setActiveUser(JSON.parse(storedUser));
        }
        setLoading(false);
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
        setSaving(true);
        try {
            const updatedUser = await updateUser(activeUser.id, activeUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            message.success("Settings saved successfully!");
        } catch (error) {
            message.error("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setIsModalVisible(true);
    };

    if (loading || !activeUser) {
        return <div className="text-center">Loading settings...</div>;
    }

    const panelHeader = (title, icon) => (
        <div className="flex items-center space-x-3 text-lg font-semibold">{icon}{title}</div>
    );
    
    const basicsItems = [
        { key: 'height', icon: <Ruler />, label: 'Height', value: activeUser.userBasics.height, type: 'height' },
        { key: 'exercise', icon: <Dumbbell />, label: 'Exercise', value: activeUser.userBasics.exercise, type: 'radio', options: ['Active', 'Sometimes', 'Never'] },
        { key: 'education', icon: <GraduationCap />, label: 'Education', value: activeUser.userBasics.education, type: 'radio', options: ['High School', 'Undergraduate', 'Postgraduate'] },
        { key: 'drinking', icon: <GlassWater />, label: 'Drinking', value: activeUser.userBasics.drinking, type: 'radio', options: ['Frequently', 'Socially', 'Rarely', 'Never', 'Sober'] },
        { key: 'smoking', icon: <Cigarette />, label: 'Smoking', value: activeUser.userBasics.smoking, type: 'radio', options: ['Socially', 'Never', 'Regularly'] },
        { key: 'lookingFor', icon: <Heart />, label: 'Looking for', value: activeUser.userBasics.lookingFor, type: 'radio', options: ['Relationship', 'Something Casual', "Don't know yet"] },
        { key: 'kids', icon: <Baby />, label: 'Kids', value: activeUser.userBasics.kids, type: 'radio', options: ["Want someday", "Don't want", "Have & want more", "Have & don't want more"] },
        { key: 'starSign', icon: <Sparkles />, label: 'Star sign', value: activeUser.userBasics.starSign, type: 'radio', options: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] },
        { key: 'politics', icon: <Landmark />, label: 'Politics', value: activeUser.userBasics.politics, type: 'radio', options: ['Apolitical', 'Moderate', 'Liberal', 'Conservative'] },
        { key: 'religion', icon: <Church />, label: 'Religion', value: activeUser.userBasics.religion, type: 'radio', options: ['Christian', 'Muslim', 'Hindu', 'Buddhist', 'Jewish', 'Spiritual', 'Other'] },
    ];

    return (
        <>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                    <p className="text-gray-500">Manage your profile and account preferences.</p>
                </div>

                <Collapse defaultActiveKey={['1']} accordion className="bg-white rounded-lg shadow-sm border-none">
                    <Panel header={panelHeader("Edit Profile", <User className="text-pink-500" />)} key="1">
                        <div className="space-y-6 p-4">
                            <div>
                                <label className="block font-semibold mb-2">Profile Photo</label>
                                <img src={activeUser.userProfile.profileImageUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover" onError={(e) => { e.target.src = "https://placehold.co/128x128/71717a/FFFFFF?text=User"; }} />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">About Me (Bio)</label>
                                <TextArea rows={4} value={activeUser.userProfile.bio} onChange={(e) => handleStateChange('userProfile', 'bio', e.target.value)} />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">My Interests</label>
                                <Select mode="tags" style={{ width: '100%' }} value={activeUser.interests} onChange={(val) => handleTopLevelChange('interests', val)} />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">I want to...</label>
                                <Select mode="tags" style={{ width: '100%' }} value={activeUser.wantsTo} onChange={(val) => handleTopLevelChange('wantsTo', val)} />
                            </div>
                        </div>
                    </Panel>
                    
                    <Panel header={panelHeader("My Basics", <Plus className="text-pink-500" />)} key="2">
                        <div className="space-y-2 p-4">
                            {basicsItems.map(item => (
                                <button key={item.key} onClick={() => openEditModal(item)} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center text-gray-500">
                                        {item.icon}
                                        <span className="ml-4 text-md text-gray-700">{item.label}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">{item.value}</span>
                                </button>
                            ))}
                        </div>
                    </Panel>

                    <Panel header={panelHeader("Personality", <Heart className="text-pink-500" />)} key="3">
                        <div className="space-y-6 p-4">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-2">Your partner is having a bad day. What do you do?</label>
                                <Radio.Group value={activeUser.userPersonality.q1_care} onChange={(e) => handleStateChange('userPersonality', 'q1_care', e.target.value)}>
                                    <Radio value="Listen and support">Listen and support</Radio>
                                    <Radio value="Try to cheer them up">Try to cheer them up</Radio>
                                    <Radio value="Give them space">Give them space</Radio>
                                </Radio.Group>
                            </div>
                            {/* Add other personality questions here following the same pattern */}
                        </div>
                    </Panel>
                    
                    <Panel header={panelHeader("Account Info", <SettingsIcon className="text-pink-500" />)} key="4">
                        <div className="space-y-4 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center"><Phone className="w-5 h-5 mr-3 text-gray-500" /><span>Phone Number</span></div>
                                <span className="font-semibold">{activeUser.userProfile.phone}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center"><Mail className="w-5 h-5 mr-3 text-gray-500" /><span>Email Address</span></div>
                                <span className="font-semibold">{activeUser.email}</span>
                            </div>
                        </div>
                    </Panel>
                </Collapse>

                <div className="flex pt-8">
                    <Button type="primary" size="large" onClick={handleSaveChanges} loading={saving} className="bg-pink-500">
                        Save Changes
                    </Button>
                </div>
            </div>

            <BasicsEditModal isOpen={isModalVisible} onCancel={() => setIsModalVisible(false)} item={editingItem} onSave={(key, value) => handleStateChange('userBasics', key, value)} />
        </>
    );
};

export default SettingsPage;