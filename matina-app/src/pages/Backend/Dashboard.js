import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import DiscoveryPage from '../Frontend/DiscoveryPage';
import LikedPage from '../Frontend/LikedPage';
import ChatsPage from '../Frontend/ChatsPage';
import SettingsPage from '../Frontend/SettingsPage';

const Dashboard = ({ user, onUserUpdate, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('discovery');

  const handleNavigate = (page) => {
    if (page === 'logout') {
      onLogout();
    } else {
      setCurrentPage(page);
    }
  };

  const renderCurrentPage = () => {
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
        // It correctly passes all props to SettingsPage
        return <SettingsPage user={user} onUserUpdate={onUserUpdate} onLogout={onLogout} />;
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