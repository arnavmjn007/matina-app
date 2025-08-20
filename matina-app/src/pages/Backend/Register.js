import { useState } from 'react';
import { message, Input, Button } from 'antd';
import ProfileSetupForm from '../../components/registration/ProfileSetupForm';

// This component manages the two stages of registration: credentials and profile setup.
const Register = ({ navigateTo }) => {
    const [stage, setStage] = useState('credentials');
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleCredentialsSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (!email || !password || !confirmPassword) {
            return message.error('Please fill in all fields.');
        }
        if (password !== confirmPassword) {
            return message.error('Passwords do not match.');
        }

        setCredentials({ email, password });
        message.success("Great! Now, let's set up your profile.");
        setStage('profile');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {stage === 'credentials' ? (
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex max-w-5xl w-full">
                    <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/images/loginbg.jpg')` }} />
                    <div className="w-full lg:w-1/2 p-8 sm:p-12">
                        <h2 className="font-display text-4xl font-bold text-gray-900 mb-8">Create Account</h2>
                        <form onSubmit={handleCredentialsSubmit}>
                            <div className="space-y-6">
                                <Input size="large" name="email" placeholder="Email Address" type="email" required />
                                <Input.Password size="large" name="password" placeholder="Password" required />
                                <Input.Password size="large" name="confirmPassword" placeholder="Confirm Password" required />
                                <Button type="primary" size="large" block htmlType="submit" className="bg-pink-500">Continue</Button>
                            </div>
                        </form>
                        <div className="mt-8 text-center text-sm">
                            <span className="font-medium text-gray-600">
                                Already have an account?{' '}
                                <button onClick={() => navigateTo('login')} className="font-bold text-pink-600 hover:text-pink-500">
                                    Sign In
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <ProfileSetupForm
                    initialCredentials={credentials}
                    onFinish={() => navigateTo('login')}
                />
            )}
        </div>
    );
};

export default Register;