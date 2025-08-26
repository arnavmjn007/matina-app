import React, { useState, useEffect, useCallback } from 'react';
// 1. Import the Ant Design App component
import { App as AntApp } from 'antd';
import Login from './pages/Backend/Login';
import Register from './pages/Backend/Register';
import Dashboard from './pages/Backend/Dashboard';

function App() {
    const [user, setUser] = useState(null);
    const [authView, setAuthView] = useState('login');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    }, []);

    const handleUserUpdate = (updatedUser) => {
        if (updatedUser) {
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
    };

    // Helper function to render the correct view based on auth state
    const renderContent = () => {
        if (user) {
            return (
                <Dashboard
                    user={user}
                    onUserUpdate={handleUserUpdate}
                    onLogout={handleLogout}
                />
            );
        }

        switch (authView) {
            case 'register':
                return <Register navigateTo={() => setAuthView('login')} />;
            case 'login':
            default:
                return <Login onLogin={handleLogin} navigateTo={() => setAuthView('register')} />;
        }
    };

    // 2. Wrap the entire rendered output in the <AntApp> provider
    return (
        <AntApp>
            {renderContent()}
        </AntApp>
    );
}

export default App;