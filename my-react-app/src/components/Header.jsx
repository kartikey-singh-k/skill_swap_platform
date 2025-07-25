import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleProfileClick = () => {
    navigate(user ? "/profile" : "/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="left-section" onClick={() => navigate("/")}>
        <h1 className="site-title">Skill Swap Platform</h1>
      </div>

      <div className="right-section">
        {user ? (
          <>
            <span className="welcome-text">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={handleProfileClick} className="header-btn">Profile</button>
            <button onClick={handleLogout} className="header-btn">Logout</button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} className="header-btn">Login</button>
        )}
      </div>
    </header>
  );
}

export default Header;
