import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { loginUser } from '../../services/userService';

function Login({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await loginUser(email, password);
      message.success('Login successful!');
      localStorage.setItem('user', JSON.stringify(userData));
      navigateTo('dashboard');
    } catch (apiError) {
      const errorMessage = apiError.response?.data || 'Invalid email or password.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex max-w-5xl w-full">
        <div
          className="hidden lg:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/loginbg.jpg')` }}
        />
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="flex items-center mb-12">
            <img src="/images/hearts.png" alt="Matina Logo" className="w-8 h-8 mr-2" />
            <span className="font-display text-3xl text-pink-600">Matina</span>
          </div>
          <div>
            <div className="text-center lg:text-left mb-8">
              <h2 className="font-display text-4xl font-bold text-gray-900">Welcome Back!</h2>
              <p className="text-gray-500 mt-2">Sign in to continue your journey.</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <Input
                size="large"
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input.Password
                size="large"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-center">{error}</p>}
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="bg-pink-500 hover:bg-pink-600 border-pink-500"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </div>
          <div className="mt-8 text-center text-sm">
            <span className="font-medium text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => navigateTo('register')} className="font-bold text-pink-600 hover:text-pink-500">
                Signup
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;