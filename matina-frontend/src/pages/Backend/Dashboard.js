import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import DiscoveryPage from "../Frontend/DiscoveryPage";
import LikedPage from "../Frontend/LikedPage";
import ChatsPage from "../Frontend/ChatsPage";
import SettingsPage from "../Frontend/SettingsPage";

const Dashboard = ({ user, onUserUpdate, onLogout, onRequireAuth }) => {
  const [currentPage, setCurrentPage] = useState("discovery");
  const isGuest = !user;

  const handleNavigate = (page) => {
    if (page === "logout") {
      if (isGuest) onRequireAuth?.();
      else onLogout();
      return;
    }
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "discovery":
        return <DiscoveryPage user={user} onRequireAuth={onRequireAuth} />;

      case "liked":
        if (isGuest)
          return <DiscoveryPage user={null} onRequireAuth={onRequireAuth} />;
        return <LikedPage user={user} />;

      case "chats":
        if (isGuest)
          return <DiscoveryPage user={null} onRequireAuth={onRequireAuth} />;
        return <ChatsPage user={user} />;

      case "settings":
        if (isGuest)
          return <DiscoveryPage user={null} onRequireAuth={onRequireAuth} />;
        return (
          <SettingsPage
            user={user}
            onUserUpdate={onUserUpdate}
            onLogout={onLogout}
          />
        );

      default:
        return <DiscoveryPage user={user} onRequireAuth={onRequireAuth} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        navigateTo={handleNavigate}
        currentPage={currentPage}
        activeUser={user}
        onRequireAuth={onRequireAuth}
      />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Dashboard;
