import {
    Ruler, Dumbbell, GraduationCap, GlassWater, Cigarette, Heart, Baby, Sparkles, Landmark, Church
} from 'lucide-react';

// 1. Defines the steps for the Ant Design <Steps> component.
export const STEPS = [
    { title: 'Your Name' }, { title: 'Birthday' }, { title: 'Gender' },
    { title: 'Contact Info' }, { title: 'Photos' }, { title: 'My Basics' },
    { title: 'Personality' }, { title: 'About You' }
];

// 2. Defines the options for the <Select> components in the "About You" step.
export const INTEREST_OPTIONS = ["Photography", "Shopping", "Karaoke", "Yoga", "Cooking", "Tennis", "Running", "Swimming", "Art", "Traveling", "Culture", "Music", "Food", "Sports"];
export const WANTS_TO_OPTIONS = ["Travel", "Marry", "Meet new people", "Learn new things", "Find a partner", "Adopt a pet", "Start a family", "Volunteer", "Explore spirituality"];

// 3. This is the UI CONFIGURATION for the "My Basics" step.
// Notice the 'options' array is here, defining the choices for the radio buttons.
export const getBasicsItems = (basicsData) => [
    { key: 'height', icon: <Ruler size={24} />, label: 'Height', value: basicsData.height, type: 'height' },
    { key: 'exercise', icon: <Dumbbell size={24} />, label: 'Exercise', value: basicsData.exercise, type: 'radio', options: ['Active', 'Sometimes', 'Never'] },
    { key: 'education', icon: <GraduationCap size={24} />, label: 'Education level', value: basicsData.education, type: 'radio', options: ['High School', 'Undergraduate', 'Postgraduate'] },
    { key: 'drinking', icon: <GlassWater size={24} />, label: 'Drinking', value: basicsData.drinking, type: 'radio', options: ['Frequently', 'Socially', 'Rarely', 'Never', 'Sober'] },
    { key: 'smoking', icon: <Cigarette size={24} />, label: 'Smoking', value: basicsData.smoking, type: 'radio', options: ['Socially', 'Never', 'Regularly'] },
    { key: 'lookingFor', icon: <Heart size={24} />, label: 'Looking for', value: basicsData.lookingFor, type: 'radio', options: ['Relationship', 'Something Casual', "Don't know yet"] },
    { key: 'kids', icon: <Baby size={24} />, label: 'Kids', value: basicsData.kids, type: 'radio', options: ["Want someday", "Don't want", "Have & want more", "Have & don't want more"] },
    { key: 'starSign', icon: <Sparkles size={24} />, label: 'Star sign', value: basicsData.starSign, type: 'radio', options: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] },
    { key: 'politics', icon: <Landmark size={24} />, label: 'Politics', value: basicsData.politics, type: 'radio', options: ['Apolitical', 'Moderate', 'Liberal', 'Conservative'] },
    { key: 'religion', icon: <Church size={24} />, label: 'Religion', value: basicsData.religion, type: 'radio', options: ['Christian', 'Hindu', 'Jewish', 'Muslim', 'Spiritual but not religious', 'Other'] },
];

// 4. This is the initial DATA STATE for your form.
// It's the "answer sheet" – it only holds the values, not the questions or options.
export const INITIAL_FORM_DATA = {
    // Core User fields
    email: '',
    password: '',
    firstName: '',
    lastName: '',


    // Nested UserProfile object
    userProfile: {
        birthday: null,
        gender: '',
        phone: '',    
        address: '',
        bio: '',
    },

    // Nested UserBasics object
    userBasics: {
        height: '170 cm',
        exercise: 'Sometimes',
        education: 'Undergraduate',
        drinking: 'Socially',
        smoking: 'Never',
        lookingFor: 'Relationship',
        kids: "Don't want",
        starSign: 'Pisces',
        politics: 'Apolitical',
        religion: 'Buddhist',
    },

    // Nested UserPersonality object
    userPersonality: {
        q1_care: null,
        q2_love: null,
        q3_cute: null,
        love: 50, // Calculated fields can start with a default
        care: 50,
        cute: 50,
    },

    // Lists remain at the top level
    interests: [],
    wantsTo: [],

    // Photos list for the UI (not sent directly in this object)
    photos: [],
};