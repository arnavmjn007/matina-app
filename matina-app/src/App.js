import React, { useState, useEffect } from 'react';
import Login from './pages/Backend/Login';
import Register from './pages/Backend/Register';
import Dashboard from './pages/Backend/Dashboard';

function App() {
    // 'view' controls which page to show: 'login', 'register', or 'dashboard'
    const [view, setView] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // When the app first loads, check if the user is already logged in from a previous session.
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    // Function to handle logging out the user
    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setView('login'); // Redirect to login screen
    };

    // Main navigation function passed to child components
    const navigateTo = (page) => {
        if (page === 'dashboard') {
            setIsLoggedIn(true);
        }
        setView(page);
    };

    // If the user is logged in, show the main dashboard.
    if (isLoggedIn) {
        return <Dashboard onLogout={handleLogout} />;
    }

    // If not logged in, show either the login or register page.
    switch (view) {
        case 'register':
            return <Register navigateTo={navigateTo} />;
        case 'login':
        default:
            return <Login navigateTo={navigateTo} />;
    }
}

export default App;