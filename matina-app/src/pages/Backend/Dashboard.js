import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import DiscoveryPage from '../Frontend/DiscoveryPage';
import LikedPage from '../Frontend/LikedPage';
import ChatsPage from '../Frontend/ChatsPage';
import SettingsPage from '../Frontend/SettingsPage';

const Dashboard = ({ onLogout }) => {
  const [activeUser, setActiveUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('discovery');

  const loadUser = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
    } else {
      onLogout();
    }
  }, [onLogout]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleNavigate = (page) => {
    if (page === 'logout') {
      onLogout();
    } else {
      setCurrentPage(page);
    }
  };

  const renderCurrentPage = () => {
    // FIX: The core issue is here. If activeUser is null,
    // it returns a loading state, preventing the render
    if (!activeUser) {
      return <div>Loading...</div>;
    }

    switch (currentPage) {
      case 'discovery':
        return <DiscoveryPage user={activeUser} />;
      case 'liked':
        return <LikedPage user={activeUser} />;
      case 'chats':
        return <ChatsPage user={activeUser} />;
      case 'settings':
        return <SettingsPage user={activeUser} onUserUpdate={loadUser} />;
      default:
        return <DiscoveryPage user={activeUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar navigateTo={handleNavigate} currentPage={currentPage} activeUser={activeUser} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Dashboard;