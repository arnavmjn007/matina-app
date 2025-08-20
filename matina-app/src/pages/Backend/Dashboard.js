import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

// --- Placeholder Page Components ---
// In a real app, you would import these from separate files.
const DiscoveryPage = ({ user }) => <div className="text-4xl font-bold">Discovery Page for {user.firstName}</div>;
const LikedPage = () => <div className="text-4xl font-bold">Liked Profiles</div>;
const ChatsPage = () => <div className="text-4xl font-bold">Your Chats</div>;
const SettingsPage = () => <div className="text-4xl font-bold">Settings</div>;
// --- End of Placeholder Components ---

const Dashboard = ({ onLogout }) => {
    const [activeUser, setActiveUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setActiveUser(JSON.parse(storedUser));
        } else {
            onLogout();
        }
    }, [onLogout]);

    const [currentPage, setCurrentPage] = useState('discovery');

    const handleNavigate = (page) => {
        if (page === 'logout') {
            onLogout();
        } else {
            setCurrentPage(page);
        }
    };

    const renderCurrentPage = () => {
        if (!activeUser) {
            return <div>Loading...</div>;
        }
        switch (currentPage) {
            case 'discovery': return <DiscoveryPage user={activeUser} />;
            case 'liked': return <LikedPage />;
            case 'chats': return <ChatsPage />;
            case 'settings': return <SettingsPage />;
            default: return <DiscoveryPage user={activeUser} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                navigateTo={handleNavigate}
                currentPage={currentPage}
                activeUser={activeUser}
            />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderCurrentPage()}
            </main>
        </div>
    );
};

export default Dashboard;