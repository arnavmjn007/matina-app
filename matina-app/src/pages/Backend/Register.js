import { useState, useEffect } from 'react';
import {
    Steps, Button, message, Input, DatePicker, Radio, Upload, Select, Slider, Modal
} from 'antd';
import {
    UploadOutlined, ManOutlined, WomanOutlined
} from '@ant-design/icons';
import {
    Ruler, Dumbbell, GraduationCap, GlassWater, Cigarette, Heart, Baby, Sparkles, Landmark, Church, Plus
} from 'lucide-react';
import 'antd/dist/reset.css';
// Make sure you have this service for the API call
// import { createUser } from '../../services/userService'; 

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
                        <Slider min={120} max={220} value={numValue} onChange={(val) => setCurrentValue(`${val} cm`)} />
                    </>
                );
            case 'radio':
                return (
                    <Radio.Group onChange={(e) => setCurrentValue(e.target.value)} value={currentValue} className="flex flex-col space-y-3">
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
        <Modal open={isOpen} onCancel={onCancel} centered footer={null} width={400}>
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

// Sub-component for the multi-step profile form
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
        personality: {
            q1_care: null,
            q2_love: null,
            q3_cute: null,
        }
    });

    useEffect(() => {
        const calculateTraits = () => {
            const scores = { love: 50, care: 50, cute: 50 };
            if (formData.personality.q1_care === 'Listen and support') scores.care = 100;
            else if (formData.personality.q1_care === 'Try to cheer them up') scores.care = 60;
            else if (formData.personality.q1_care === 'Give them space') scores.care = 20;

            if (formData.personality.q2_love === 'A fancy, planned dinner') scores.love = 100;
            else if (formData.personality.q2_love === 'A spontaneous adventure') scores.love = 70;
            else if (formData.personality.q2_love === 'Chilling at home') scores.love = 40;

            if (formData.personality.q3_cute === 'Goofy and playful') scores.cute = 100;
            else if (formData.personality.q3_cute === 'Sarcastic and witty') scores.cute = 70;
            else if (formData.personality.q3_cute === 'I am more serious') scores.cute = 20;

            setFormData(prev => ({ ...prev, love: scores.love, care: scores.care, cute: scores.cute }));
        };
        calculateTraits();
    }, [formData.personality]);

    const handleNext = () => setCurrent(current + 1);
    const handlePrev = () => setCurrent(current - 1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBasicsChange = (key, value) => setFormData({ ...formData, basics: { ...formData.basics, [key]: value } });
    const handlePersonalityChange = (key, value) => setFormData({ ...formData, personality: { ...formData.personality, [key]: value } });

    const openEditModal = (item) => {
        setEditingItem(item);
        setIsModalVisible(true);
    };

    const handleFinish = async () => {
        console.log("Final Registration Data:", formData);
        // In a real app, you would uncomment the following lines:
        /*
        try {
            const imageFile = formData.photos[0]?.originFileObj;
            if (!imageFile) {
                return message.error("Please upload at least one photo.");
            }
            const userPayload = { ...formData };
            delete userPayload.photos;
            await createUser(userPayload, imageFile);
            message.success('Registration Complete!');
            navigateTo('login');
        } catch (error) {
            message.error('Registration failed. Please try again.');
        }
        */
        message.success('Registration Complete!');
        navigateTo('login');
    };

    const steps = [
        { title: 'Your Name' }, { title: 'Birthday' }, { title: 'Gender' },
        { title: 'Contact Info' }, { title: 'Photos' }, { title: 'My Basics' },
        { title: 'Personality' }, { title: 'About You' }
    ];

    const interestOptions = ["Photography", "Shopping", "Karaoke", "Yoga", "Cooking", "Tennis", "Running", "Swimming", "Art", "Traveling", "Culture", "Music", "Food", "Sports"];
    const wantsToOptions = ["Travel", "Marry", "Meet new people", "Learn new things", "Find a partner", "Adopt a pet", "Start a family", "Volunteer", "Explore spirituality"];

    const basicsItems = [
        { key: 'height', icon: <Ruler size={24} />, label: 'Height', value: formData.basics.height, type: 'height' },
        { key: 'exercise', icon: <Dumbbell size={24} />, label: 'Exercise', value: formData.basics.exercise, type: 'radio', options: ['Active', 'Sometimes', 'Never'] },
        { key: 'education', icon: <GraduationCap size={24} />, label: 'Education level', value: formData.basics.education, type: 'radio', options: ['High School', 'Undergraduate', 'Postgraduate'] },
        { key: 'drinking', icon: <GlassWater size={24} />, label: 'Drinking', value: formData.basics.drinking, type: 'radio', options: ['Frequently', 'Socially', 'Rarely', 'Never', 'Sober'] },
        { key: 'smoking', icon: <Cigarette size={24} />, label: 'Smoking', value: formData.basics.smoking, type: 'radio', options: ['Socially', 'Never', 'Regularly'] },
        { key: 'lookingFor', icon: <Heart size={24} />, label: 'Looking for', value: formData.basics.lookingFor, type: 'radio', options: ['Relationship', 'Something Casual', "Don't know yet"] },
        { key: 'kids', icon: <Baby size={24} />, label: 'Kids', value: formData.basics.kids, type: 'radio', options: ["Want someday", "Don't want", "Have & want more", "Have & don't want more"] },
        { key: 'starSign', icon: <Sparkles size={24} />, label: 'Star sign', value: formData.basics.starSign, type: 'radio', options: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] },
        { key: 'politics', icon: <Landmark size={24} />, label: 'Politics', value: formData.basics.politics, type: 'radio', options: ['Apolitical', 'Moderate', 'Liberal', 'Conservative'] },
        { key: 'religion', icon: <Church size={24} />, label: 'Religion', value: formData.basics.religion, type: 'radio', options: ['Christian', 'Hindu', 'Jewish', 'Muslim', 'Spiritual but not religious', 'Other'] },
    ];

    const stepContent = [
        <div key="step0"><h2 className="text-3xl font-bold mb-6">What's your name?</h2><div className="space-y-4"><Input size="large" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} /><Input size="large" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} /></div></div>,
        <div key="step1"><h2 className="text-3xl font-bold mb-6">When is your birthday?</h2><DatePicker size="large" style={{ width: '100%' }} onChange={(date) => setFormData({ ...formData, birthday: date })} /></div>,
        <div key="step2"><h2 className="text-3xl font-bold mb-6">How do you identify?</h2><Radio.Group onChange={(e) => setFormData({ ...formData, gender: e.target.value })} value={formData.gender} size="large" className="w-full"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Radio.Button value="man" className="h-16 flex items-center justify-center text-lg rounded-lg"><ManOutlined className="mr-2" />Man</Radio.Button><Radio.Button value="woman" className="h-16 flex items-center justify-center text-lg rounded-lg"><WomanOutlined className="mr-2" />Woman</Radio.Button></div></Radio.Group></div>,
        <div key="step3"><h2 className="text-3xl font-bold mb-6">What's your phone number?</h2><Input addonBefore="+977" size="large" placeholder="98********" name="phone" value={formData.phone} onChange={handleInputChange} /></div>,
        <div key="step4"><h2 className="text-3xl font-bold mb-6">Upload your best photos</h2><Upload.Dragger multiple listType="picture-card" beforeUpload={() => false} onChange={(info) => setFormData({ ...formData, photos: info.fileList })}><p className="ant-upload-drag-icon"><UploadOutlined /></p><p className="ant-upload-text">Click or drag files</p></Upload.Dragger></div>,
        <div key="step5"><h2 className="text-3xl font-bold mb-6">My Basics</h2><div className="space-y-2">{basicsItems.map(item => (<button key={item.key} onClick={() => openEditModal(item)} className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 text-left"><div className="flex items-center text-gray-600">{item.icon}<span className="ml-4 text-md font-semibold text-gray-800">{item.label}</span></div><div className="flex items-center"><span className="text-md text-gray-500 mr-2">{item.value || ''}</span><Plus className="text-gray-400" size={20} /></div></button>))}</div></div>,
        <div key="step6" className="space-y-8"><h2 className="text-3xl font-bold mb-6">A little about your personality...</h2><div><label className="font-semibold text-gray-700">Your partner is having a bad day. What do you do?</label><Radio.Group value={formData.personality.q1_care} onChange={(e) => handlePersonalityChange('q1_care', e.target.value)} className="mt-2 flex flex-col space-y-2"><Radio value="Listen and support">Listen and support</Radio><Radio value="Try to cheer them up">Try to cheer them up</Radio><Radio value="Give them space">Give them space</Radio></Radio.Group></div><div><label className="font-semibold text-gray-700">What's your ideal romantic evening?</label><Radio.Group value={formData.personality.q2_love} onChange={(e) => handlePersonalityChange('q2_love', e.target.value)} className="mt-2 flex flex-col space-y-2"><Radio value="A fancy, planned dinner">A fancy, planned dinner</Radio><Radio value="A spontaneous adventure">A spontaneous adventure</Radio><Radio value="Chilling at home">Chilling at home</Radio></Radio.Group></div><div><label className="font-semibold text-gray-700">What's your sense of humor like?</label><Radio.Group value={formData.personality.q3_cute} onChange={(e) => handlePersonalityChange('q3_cute', e.target.value)} className="mt-2 flex flex-col space-y-2"><Radio value="Goofy and playful">Goofy and playful</Radio><Radio value="Sarcastic and witty">Sarcastic and witty</Radio><Radio value="I am more serious">I am more serious</Radio></Radio.Group></div></div>,
        <div key="step7" className="space-y-6"><h2 className="text-3xl font-bold mb-6">And finally...</h2><div><label className="font-semibold text-gray-700">A short bio...</label><TextArea rows={4} placeholder="Tell us something interesting!" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} /></div><div><label className="font-semibold text-gray-700">My interests are...</label><Select mode="tags" style={{ width: '100%' }} placeholder="Add interests" onChange={(val) => setFormData({ ...formData, interests: val })}>{interestOptions.map(opt => <Option key={opt}>{opt}</Option>)}</Select></div><div><label className="font-semibold text-gray-700">I want to...</label><Select mode="tags" style={{ width: '100%' }} placeholder="Add your intentions" value={formData.wantsTo} onChange={(val) => setFormData({ ...formData, wantsTo: val })}>{wantsToOptions.map(opt => <Option key={opt}>{opt}</Option>)}</Select></div></div>
    ];

    return (
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden min-h-[70vh]">
            <div className="w-full md:w-1/3 p-8 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-pink-500">Create Account</h2>
                <Steps direction="vertical" current={current} items={steps} />
            </div>
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-between">
                <div>{stepContent[current]}</div>
                <div className="mt-8 flex justify-between">
                    {current > 0 && (<Button size="large" onClick={handlePrev}>Back</Button>)}
                    {current < steps.length - 1 ? (<Button type="primary" size="large" onClick={handleNext} className="bg-pink-500 hover:bg-pink-600 border-pink-500">Next</Button>) : (<Button type="primary" size="large" className="bg-green-500 hover:bg-green-600 border-green-500" onClick={handleFinish}>Finish</Button>)}
                </div>
            </div>
            <BasicsEditModal isOpen={isModalVisible} onCancel={() => setIsModalVisible(false)} item={editingItem} onSave={handleBasicsChange} />
        </div>
    );
};

// Main Register Component
const Register = ({ navigateTo }) => {
    const [step, setStep] = useState('credentials'); // credentials, profile
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleContinue = () => {
        if (!email || !password || !confirmPassword) {
            return message.error('Please fill in all fields.');
        }
        if (password !== confirmPassword) {
            return message.error('Passwords do not match.');
        }
        message.success('Account created! Now, let\'s set up your profile.');
        setStep('profile');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {step !== 'profile' ? (
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex max-w-5xl w-full">
                    <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/images/loginbg.jpg')` }} />
                    <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                        <div className="flex items-center mb-12"><img src="/images/hearts.png" alt="Matina Logo" className="w-8 h-8 mr-2" /><span className="font-display text-3xl text-pink-600">Matina</span></div>
                        <div>
                            <div className="text-center lg:text-left mb-8"><h2 className="font-display text-4xl font-bold text-gray-900">Create Account</h2><p className="text-gray-500 mt-2">Join the Matina community.</p></div>
                            <div className="space-y-6">
                                <Input size="large" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                                <Input.Password size="large" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Input.Password size="large" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <Button type="primary" size="large" block onClick={handleContinue} className="bg-pink-500 hover:bg-pink-600 border-pink-500">Continue</Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <ProfileSetupForm navigateTo={navigateTo} />
            )}
        </div>
    );
};

export default Register;
