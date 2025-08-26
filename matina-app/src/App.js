import React, { useState, useEffect, useCallback } from 'react';
import Login from './pages/Backend/Login';
import Register from './pages/Backend/Register';
import Dashboard from './pages/Backend/Dashboard';

function App() {
    const [view, setView] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    // FIX: Wrap handleLogout in useCallback to make it a stable reference
    const handleLogout = useCallback(() => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setView('login');
    }, []);

    const navigateTo = (page) => {
        if (page === 'dashboard') {
            setIsLoggedIn(true);
        }
        setView(page);
    };

    const handleRegistrationComplete = () => {
        setView('login');
    };

    if (isLoggedIn) {
        // Now passing a stable reference to handleLogout
        return <Dashboard onLogout={handleLogout} />;
    }

    switch (view) {
        case 'register':
            return <Register navigateTo={navigateTo} onRegistrationComplete={handleRegistrationComplete} />;
        case 'login':
        default:
            return <Login navigateTo={navigateTo} setIsLoggedIn={setIsLoggedIn} />;
    }
}

export default App;