import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import DiscoveryPage from '../Frontend/DiscoveryPage';
import LikedPage from '../Frontend/LikedPage';
import ChatsPage from '../Frontend/ChatsPage';
import SettingsPage from '../Frontend/SettingsPage';

// 1. The component now receives its data as props from App.jsx
const Dashboard = ({ user, onUserUpdate, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('discovery');

  // 2. We no longer need 'activeUser' state or the 'loadUser' function.
  // The 'user' prop is always the most up-to-date version.

  const handleNavigate = (page) => {
    if (page === 'logout') {
      onLogout();
    } else {
      setCurrentPage(page);
    }
  };

  const renderCurrentPage = () => {
    // This check is still good practice.
    if (!user) {
      return <div>Loading user data...</div>;
    }

    switch (currentPage) {
      case 'discovery':
        return <DiscoveryPage user={user} />;
      case 'liked':
        return <LikedPage user={user} />;
      case 'chats':
        return <ChatsPage user={user} />;
      case 'settings':
        // 3. We pass the onUserUpdate function from App.jsx directly to SettingsPage.
        // This connects the "Save" button directly to the master update function.
        return <SettingsPage user={user} onUserUpdate={onUserUpdate} />;
      default:
        return <DiscoveryPage user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar navigateTo={handleNavigate} currentPage={currentPage} activeUser={user} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Dashboard;