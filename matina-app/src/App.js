import React, { useState, useEffect, useCallback } from "react";
import { App as AntApp } from "antd";
import Login from "./pages/Backend/Login";
import Register from "./pages/Backend/Register";
import Dashboard from "./pages/Backend/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("dashboard");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setAuthView("login");
  }, []);

  const handleUserUpdate = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setAuthView("login");
  };

  const renderContent = () => {
    if (authView === "dashboard") {
      return (
        <Dashboard
          user={user}
          onUserUpdate={handleUserUpdate}
          onLogout={handleLogout}
          requireAuth={(targetView = "login") => setAuthView(targetView)}
        />
      );
    }

    switch (authView) {
      case "register":
        return (
          <Register
            navigateTo={() => setAuthView("login")}
            onRegistrationComplete={() => setAuthView("login")}
          />
        );

      case "login":
      default:
        return (
          <Login
            onLogin={(u) => {
              handleLogin(u);
              setAuthView("dashboard"); 
            }}
            navigateTo={() => setAuthView("register")}
          />
        );
    }
  };

  return <AntApp>{renderContent()}</AntApp>;
}

export default App;
