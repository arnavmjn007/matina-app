import { useState, useEffect } from 'react';
import FrontendLayout from './components/templates/frontend/FrontendLayout';
import { getAllUsers } from './services/userService';

// Import all page components
import DiscoveryPage from './pages/Frontend/DiscoveryPage';
import ChatsPage from './pages/Frontend/ChatsPage';
import LikedPage from './pages/Frontend/LikedPage';
import SettingsPage from './pages/Frontend/SettingsPage';
import PremiumPage from './pages/Frontend/PremiumPage';
import Login from './pages/Backend/Login';
import Register from './pages/Backend/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [activeUser, setActiveUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Fetch all users from the db.json file when the app starts
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // This function now finds the user in the database
  const handleLogin = (email, password) => {
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setActiveUser(user);
      navigateTo('discovery');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setActiveUser(null);
    navigateTo('login');
  };

  if (!activeUser) {
    switch (currentPage) {
      case 'register':
        return <Register navigateTo={navigateTo} />;
      case 'login':
      default:
        return <Login navigateTo={navigateTo} onLoginSuccess={handleLogin} />;
    }
  }

  const renderMainAppPage = () => {
    switch (currentPage) {
      case 'discovery':
        return <DiscoveryPage navigateTo={navigateTo} activeUser={activeUser} />;
      case 'chats':
        return <ChatsPage navigateTo={navigateTo} />;
      case 'liked':
        return <LikedPage navigateTo={navigateTo} />;
      case 'settings':
        return <SettingsPage navigateTo={navigateTo} activeUser={activeUser} />;
      case 'premium':
        return <PremiumPage navigateTo={navigateTo} />;
      case 'logout':
        handleLogout();
        return null;
      default:
        return <DiscoveryPage navigateTo={navigateTo} activeUser={activeUser} />;
    }
  };

  return (
    <FrontendLayout navigateTo={navigateTo} currentPage={currentPage} activeUser={activeUser}>
      {renderMainAppPage()}
    </FrontendLayout>
  );
}

export default App;
