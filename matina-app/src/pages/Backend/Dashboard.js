import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import DiscoveryPage from '../Frontend/DiscoveryPage';
import LikedPage from '../Frontend/LikedPage';
import ChatsPage from '../Frontend/ChatsPage';
import SettingsPage from '../Frontend/SettingsPage';

const Dashboard = ({ onLogout }) => {
  const [activeUser, setActiveUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('discovery');

  useEffect(() => {
    // FIX: Move the loadUser function inside the effect
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setActiveUser(JSON.parse(storedUser));
      } else {
        // onLogout is also a dependency, so we should include it
        onLogout();
      }
    };

    loadUser();
  }, [onLogout]); // FIX: Now include onLogout in the dependency array

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
      case 'settings': return <SettingsPage user={activeUser} onUserUpdate={() => {
        // After a user update, re-fetch user data from localStorage
        const storedUser = localStorage.getItem('user');
        setActiveUser(storedUser ? JSON.parse(storedUser) : null);
      }} />;
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