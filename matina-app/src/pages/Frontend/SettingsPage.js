import { useState, useEffect } from 'react';
import {
  User, Filter, Settings as SettingsIcon, Trash2, Ruler, Dumbbell,
  GraduationCap, GlassWater, Cigarette, Heart, Baby, Sparkles, Landmark, Church, Plus,
  Phone, Mail, Bell, Shield
} from 'lucide-react';
import { PlusOutlined } from '@ant-design/icons';
import { Slider, Radio, Switch, Button, Input, Select, Upload as AntUpload, Collapse, message, Modal } from 'antd';
import 'antd/dist/reset.css';
import { updateUser, getUserById } from '../../services/userService';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

// Reusable Modal for Editing Basics
const BasicsEditModal = ({ isOpen, onCancel, item, onSave }) => {
  const [currentValue, setCurrentValue] = useState(item?.value);

  useEffect(() => {
    setCurrentValue(item?.value);
  }, [item]);

  const renderInput = () => {
    if (!item) return null;

    switch (item.type) {
      case 'height':
        const numValue = parseInt(currentValue) || 170;
        return (
          <>
            <div className="text-center text-2xl font-bold mb-4">{currentValue || `${numValue} cm`}</div>
            <Slider
              min={120}
              max={220}
              value={numValue}
              onChange={(val) => setCurrentValue(`${val} cm`)}
            />
          </>
        );
      case 'radio':
        return (
          <Radio.Group
            onChange={(e) => setCurrentValue(e.target.value)}
            value={currentValue}
            className="flex flex-col space-y-3"
          >
            {item.options.map(opt => <Radio.Button key={opt} value={opt} className="rounded-full text-center h-12 flex items-center justify-center">{opt}</Radio.Button>)}
          </Radio.Group>
        );
      default:
        return <Input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />;
    }
  };

  const handleSave = () => {
    onSave(item.key, currentValue);
    onCancel();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      centered
      footer={null}
      width={400}
    >
      <div className="p-6 text-center">
        <div className="flex justify-center text-yellow-500 mb-4">{item?.icon}</div>
        <h2 className="text-2xl font-bold mb-6">What is your {item?.label.toLowerCase()}?</h2>
        {renderInput()}
        <div className="mt-8 flex flex-col space-y-2">
          <Button type="primary" size="large" block onClick={handleSave} className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 text-black font-bold">
            {item?.type === 'height' ? "Yep, that's how tall I am" : "Save"}
          </Button>
          <Button size="large" block onClick={onCancel}>Skip</Button>
        </div>
      </div>
    </Modal>
  );
};


const SettingsPage = ({ navigateTo }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserById(1);
        if (!userData.discoverySettings) userData.discoverySettings = { interestedIn: 'everyone', ageRange: [18, 30], distance: 50 };
        if (!userData.accountSettings) userData.accountSettings = { notifications: true, profileVisible: true };
        if (!userData.basics) {
          userData.basics = {
            height: "181 cm", exercise: "Active", education: "Graduate degree", drinking: "Frequently",
            smoking: "Never", lookingFor: "Relationship", kids: "Don't want", starSign: "Pisces", politics: "Apolitical", religion: "Buddhist"
          };
        }
        if (!userData.personality) {
            userData.personality = {
                q1_care: "Listen and support",
                q2_love: "Quality Time",
                q3_cute: "Goofy and playful"
            };
        }
        setActiveUser(userData);
      } catch (error) {
        message.error("Could not load user settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);
  
  // Effect to calculate traits whenever personality answers change
  useEffect(() => {
    if (activeUser) {
        const calculateTraits = () => {
            const scores = { love: 50, care: 50, cute: 50 };
            
            if (activeUser.personality.q1_care === 'Listen and support') scores.care = 100;
            else if (activeUser.personality.q1_care === 'Try to cheer them up') scores.care = 60;
            else if (activeUser.personality.q1_care === 'Give them space') scores.care = 20;

            if (activeUser.personality.q2_love === 'A fancy, planned dinner') scores.love = 100;
            else if (activeUser.personality.q2_love === 'A spontaneous adventure') scores.love = 70;
            else if (activeUser.personality.q2_love === 'Chilling at home') scores.love = 40;
            
            if (activeUser.personality.q3_cute === 'Goofy and playful') scores.cute = 100;
            else if (activeUser.personality.q3_cute === 'Sarcastic and witty') scores.cute = 70;
            else if (activeUser.personality.q3_cute === 'I am more serious') scores.cute = 20;

            setActiveUser(prev => ({ ...prev, love: scores.love, care: scores.care, cute: scores.cute }));
        };
        calculateTraits();
    }
  }, [activeUser?.personality]);


  const handleProfileChange = (key, value) => {
    setActiveUser(prev => ({ ...prev, [key]: value }));
  };

  const handleDiscoveryChange = (key, value) => {
    setActiveUser(prev => ({
      ...prev,
      discoverySettings: { ...prev.discoverySettings, [key]: value }
    }));
  };

  const handleAccountChange = (key, value) => {
    setActiveUser(prev => ({
      ...prev,
      accountSettings: { ...prev.accountSettings, [key]: value }
    }));
  };

  const handleBasicsChange = (key, value) => {
    setActiveUser(prev => ({
      ...prev,
      basics: { ...prev.basics, [key]: value }
    }));
  };
  
  const handlePersonalityChange = (key, value) => {
    setActiveUser(prev => ({
        ...prev,
        personality: { ...prev.personality, [key]: value }
    }));
  };

  const handleUploadChange = ({ fileList }) => {
    handleProfileChange('profileImages', fileList.map(f => f.url || (f.response && f.response.url) || ''));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await updateUser(activeUser.id, activeUser);
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
    return <div className="flex items-center justify-center h-full text-xl font-semibold text-gray-500">Loading settings...</div>;
  }

  const panelHeader = (title, icon) => (
    <div className="flex items-center">
      {icon}
      <span className="ml-3 font-semibold text-lg">{title}</span>
    </div>
  );
  
  const interestOptions = ["Photography", "Shopping", "Karaoke", "Yoga", "Cooking", "Tennis", "Running", "Swimming", "Art", "Traveling"];
  const wantsToOptions = ["Travel", "Marry", "Meet new people", "Learn new things", "Find a partner", "Adopt a pet"];

  const basicsItems = [
    { key: 'height', icon: <Ruler size={24} />, label: 'Height', value: activeUser.basics.height, type: 'height' },
    { key: 'exercise', icon: <Dumbbell size={24} />, label: 'Exercise', value: activeUser.basics.exercise, type: 'radio', options: ['Active', 'Sometimes', 'Never'] },
    { key: 'education', icon: <GraduationCap size={24} />, label: 'Education level', value: activeUser.basics.education, type: 'radio', options: ['High School', 'Undergraduate', 'Postgraduate'] },
    { key: 'drinking', icon: <GlassWater size={24} />, label: 'Drinking', value: activeUser.basics.drinking, type: 'radio', options: ['Frequently', 'Socially', 'Rarely', 'Never', 'Sober'] },
    { key: 'smoking', icon: <Cigarette size={24} />, label: 'Smoking', value: activeUser.basics.smoking, type: 'radio', options: ['Socially', 'Never', 'Regularly'] },
    { key: 'lookingFor', icon: <Heart size={24} />, label: 'Looking for', value: activeUser.basics.lookingFor, type: 'radio', options: ['Relationship', 'Something Casual', "Don't know yet"] },
    { key: 'kids', icon: <Baby size={24} />, label: 'Kids', value: activeUser.basics.kids, type: 'radio', options: ["Want someday", "Don't want", "Have & want more", "Have & don't want more"] },
    { key: 'starSign', icon: <Sparkles size={24} />, label: 'Star sign', value: activeUser.basics.starSign, type: 'radio', options: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] },
    { key: 'politics', icon: <Landmark size={24} />, label: 'Politics', value: activeUser.basics.politics, type: 'radio', options: ['Apolitical', 'Moderate', 'Liberal', 'Conservative'] },
    { key: 'religion', icon: <Church size={24} />, label: 'Religion', value: activeUser.basics.religion, type: 'radio', options: ['Christian', 'Muslim', 'Hindu', 'Buddhist', 'Jewish', 'Spiritual but not religious'] },
  ];

  return (
    <>
      <div className="h-full space-y-6 md:space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500">Manage your profile, account, and discovery preferences.</p>
        </div>

        <Collapse defaultActiveKey={['1']} accordion className="bg-white rounded-2xl shadow-lg border-none">
          <Panel header={panelHeader("Edit Profile", <User className="text-pink-500" />)} key="1">
            <div className="space-y-8">
              <AntUpload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={activeUser.profileImages.map((url, i) => ({ uid: -i, name: `image${i}.png`, status: 'done', url }))}
                onChange={handleUploadChange}
              >
                {activeUser.profileImages.length < 6 && <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>}
              </AntUpload>
              
              <Collapse ghost>
                <Panel header={<h3 className="font-semibold text-gray-600">My Profile Prompts</h3>} key="prompts">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2">About Me (Bio)</label>
                            <TextArea rows={4} value={activeUser.bio} onChange={(e) => handleProfileChange('bio', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2">My Interests</label>
                            <Select mode="tags" style={{ width: '100%' }} placeholder="Add interests" value={activeUser.interests} onChange={(val) => handleProfileChange('interests', val)}>{interestOptions.map(opt => <Option key={opt}>{opt}</Option>)}</Select>
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2">I want to...</label>
                            <Select mode="tags" style={{ width: '100%' }} placeholder="Add your intentions" value={activeUser.wantsTo} onChange={(val) => handleProfileChange('wantsTo', val)}>{wantsToOptions.map(opt => <Option key={opt}>{opt}</Option>)}</Select>
                        </div>
                    </div>
                </Panel>
                <Panel header={<h3 className="font-semibold text-gray-600">My Basics</h3>} key="basics">
                  <div className="space-y-2">
                    {basicsItems.map(item => (
                      <button key={item.key} onClick={() => openEditModal(item)} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-left">
                        <div className="flex items-center text-gray-500">
                          {item.icon}
                          <span className="ml-4 text-md text-gray-700">{item.label}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-md font-semibold text-gray-800 mr-2">{item.value || ''}</span>
                          {!item.value && <Plus className="text-gray-400" size={16} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </Panel>
                <Panel header={<h3 className="font-semibold text-gray-600">Personality & Lifestyle</h3>} key="personality">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2">Your partner is having a bad day. What do you do?</label>
                            <Radio.Group value={activeUser.personality.q1_care} onChange={(e) => handlePersonalityChange('q1_care', e.target.value)}>
                                <Radio value="Listen and support">Listen and support</Radio>
                                <Radio value="Try to cheer them up">Try to cheer them up</Radio>
                                <Radio value="Give them space">Give them space</Radio>
                            </Radio.Group>
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2">What's your ideal romantic evening?</label>
                            <Radio.Group value={activeUser.personality.q2_love} onChange={(e) => handlePersonalityChange('q2_love', e.target.value)}>
                                <Radio value="A fancy, planned dinner">A fancy, planned dinner</Radio>
                                <Radio value="A spontaneous adventure">A spontaneous adventure</Radio>
                                <Radio value="Chilling at home">Chilling at home</Radio>
                            </Radio.Group>
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2">What's your sense of humor like?</label>
                            <Radio.Group value={activeUser.personality.q3_cute} onChange={(e) => handlePersonalityChange('q3_cute', e.target.value)}>
                                <Radio value="Goofy and playful">Goofy and playful</Radio>
                                <Radio value="Sarcastic and witty">Sarcastic and witty</Radio>
                                <Radio value="I am more serious">I am more serious</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </Panel>
              </Collapse>
            </div>
          </Panel>

          <Panel header={panelHeader("Discovery Filters", <Filter className="text-pink-500" />)} key="2">
            <div className="space-y-8">
              <div>
                <label className="block text-md font-semibold text-gray-700 mb-3">I'm interested in...</label>
                <Radio.Group value={activeUser.discoverySettings.interestedIn} onChange={(e) => handleDiscoveryChange('interestedIn', e.target.value)} size="large">
                  <Radio.Button value="women">Women</Radio.Button>
                  <Radio.Button value="men">Men</Radio.Button>
                  <Radio.Button value="everyone">Everyone</Radio.Button>
                </Radio.Group>
              </div>
              <div>
                <label className="block text-md font-semibold text-gray-700 mb-3">
                  Age Range: <span className="text-pink-500 font-bold">{activeUser.discoverySettings.ageRange.join(' - ')}</span>
                </label>
                <Slider range value={activeUser.discoverySettings.ageRange} min={18} max={60} onChange={(val) => handleDiscoveryChange('ageRange', val)} />
              </div>
              <div>
                <label className="block text-md font-semibold text-gray-700 mb-3">
                  Maximum Distance: <span className="text-pink-500 font-bold">{activeUser.discoverySettings.distance} km</span>
                </label>
                <Slider value={activeUser.discoverySettings.distance} min={1} max={150} onChange={(val) => handleDiscoveryChange('distance', val)} />
              </div>
            </div>
          </Panel>

          <Panel header={panelHeader("Account Settings", <SettingsIcon className="text-pink-500" />)} key="3">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center"><Phone className="w-5 h-5 mr-3 text-gray-500" /><span className="text-md text-gray-700">Phone Number</span></div>
                <span className="text-md font-semibold text-gray-800">+977 98********</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center"><Mail className="w-5 h-5 mr-3 text-gray-500" /><span className="text-md text-gray-700">Email Address</span></div>
                <span className="text-md font-semibold text-gray-800">a***@gmail.com</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center"><Bell className="w-5 h-5 mr-3 text-gray-500" /><span className="text-md text-gray-700">Push Notifications</span></div>
                <Switch checked={activeUser.accountSettings.notifications} onChange={(val) => handleAccountChange('notifications', val)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center"><Shield className="w-5 h-5 mr-3 text-gray-500" /><span className="text-md text-gray-700">Show my profile</span></div>
                <Switch checked={activeUser.accountSettings.profileVisible} onChange={(val) => handleAccountChange('profileVisible', val)} />
              </div>
            </div>
          </Panel>
        </Collapse>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <Button type="primary" size="large" className="bg-pink-500 hover:bg-pink-600 border-pink-500" onClick={handleSaveChanges} loading={saving}>
            Save Changes
          </Button>
          <Button size="large" danger icon={<Trash2 size={16} className="mr-2" />}>
            Delete Account
          </Button>
        </div>
      </div>
      <BasicsEditModal
        isOpen={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        item={editingItem}
        onSave={handleBasicsChange}
      />
    </>
  );
}

export default SettingsPage;
