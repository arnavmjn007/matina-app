import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
// Import the real page components
import DiscoveryPage from '../Frontend/DiscoveryPage';
import LikedPage from '../Frontend/LikedPage';
import ChatsPage from '../Frontend/ChatsPage';
import SettingsPage from '../Frontend/SettingsPage';

const Dashboard = ({ onLogout }) => {
  const [activeUser, setActiveUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('discovery');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
    } else {
      onLogout();
    }
  }, [onLogout]);

  const handleNavigate = (page) => {
    if (page === 'logout') {
      onLogout();
    } else {
      setCurrentPage(page);
    }
  };

  const renderCurrentPage = () => {
    if (!activeUser) return <div>Loading...</div>;
    switch (currentPage) {
      case 'discovery': return <DiscoveryPage user={activeUser} />;
      case 'liked': return <LikedPage user={activeUser} />;
      case 'chats': return <ChatsPage user={activeUser} />;
      case 'settings': return <SettingsPage />;
      default: return <DiscoveryPage user={activeUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar navigateTo={handleNavigate} currentPage={currentPage} activeUser={activeUser} />
      <main className="flex-1 p-8 overflow-y-auto">{renderCurrentPage()}</main>
    </div>
  );
};

export default Dashboard;