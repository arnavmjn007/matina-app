import React, { useState, useEffect } from 'react';
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

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setView('login');
    };

    const navigateTo = (page) => {
        if (page === 'dashboard') {
            setIsLoggedIn(true);
        }
        setView(page);
    };

    // This function will be called when registration is finished
    const handleRegistrationComplete = () => {
        setView('login'); // Go back to the login page
    };

    if (isLoggedIn) {
        return <Dashboard onLogout={handleLogout} />;
    }

    switch (view) {
        case 'register':
            // Pass the new function as a prop
            return <Register navigateTo={navigateTo} onRegistrationComplete={handleRegistrationComplete} />;
        case 'login':
        default:
            return <Login navigateTo={navigateTo} setIsLoggedIn={setIsLoggedIn} />;
    }
}

export default App;