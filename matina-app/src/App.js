import React, { useState, useEffect, useCallback } from "react";
import { App as AntApp } from "antd";

import Login from "./pages/Backend/Login";
import Register from "./pages/Backend/Register";
import Dashboard from "./pages/Backend/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login");
  const [showAuth, setShowAuth] = useState(false); // 👈 guest landing by default

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowAuth(false); // back to guest landing
  }, []);

  const handleUserUpdate = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowAuth(false); // go back into app
  };

  const requireAuth = () => {
    setShowAuth(true);
    setAuthView("login");
  };

  const renderContent = () => {
    // If auth modal/page is open, show it
    if (showAuth && !user) {
      if (authView === "register") {
        return (
          <Register
            navigateTo={() => setAuthView("login")}
            onRegistrationComplete={() => setAuthView("login")}
          />
        );
      }
      return (
        <Login
          onLogin={handleLogin}
          navigateTo={() => setAuthView("register")}
        />
      );
    }

    // Otherwise always show Dashboard (guest or logged-in)
    return (
      <Dashboard
        user={user}
        onUserUpdate={handleUserUpdate}
        onLogout={handleLogout}
        onRequireAuth={requireAuth}
      />
    );
  };

  return <AntApp>{renderContent()}</AntApp>;
}

export default App;
