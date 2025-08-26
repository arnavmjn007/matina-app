import React, { useState, useEffect, useCallback } from 'react';
import Login from './pages/Backend/Login';
import Register from './pages/Backend/Register';
import Dashboard from './pages/Backend/Dashboard';

function App() {
    // The single source of truth for the user's data.
    const [user, setUser] = useState(null);
    const [authView, setAuthView] = useState('login'); // To switch between login/register

    // On initial app load, check localStorage to see if a user is already logged in.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null); // Logging out is as simple as setting the user to null.
    }, []);

    // This is the master update function. It updates the state AND localStorage.
    // This will be passed all the way down to the SettingsPage.
    const handleUserUpdate = (updatedUser) => {
        if (updatedUser) {
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    // This function is called by the Login component after a successful login.
    const handleLogin = (loggedInUser) => {
        // The login service already saves to localStorage, so we just update the state.
        setUser(loggedInUser);
    };

    // If the 'user' object exists, the user is logged in.
    if (user) {
        return (
            <Dashboard
                user={user}
                onUserUpdate={handleUserUpdate}
                onLogout={handleLogout}
            />
        );
    }

    // If no user, show either the login or register page.
    switch (authView) {
        case 'register':
            return <Register navigateTo={() => setAuthView('login')} />;
        case 'login':
        default:
            return <Login onLogin={handleLogin} navigateTo={() => setAuthView('register')} />;
    }
}

export default App;