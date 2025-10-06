import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import Pagination from "../components/Pagination";
import { useAuth } from "../auth";

function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Create a headers object. It will be empty for guests.
    const headers = {
      "Content-Type": "application/json",
    };

    // If a token exists, add the Authorization header for logged-in users.
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // The fetch call now runs for both guests and logged-in users.
    fetch("http://localhost:5000/api/users", { headers })
      .then((res) => {
        if (res.status === 403) { // A 403 means the token is invalid/expired
          logout();
          navigate('/login');
          throw new Error('Session expired. Please log in again.');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch user profiles.');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProfiles(data);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load profiles:", err.message);
        // Clear profiles on error to avoid showing stale data
        setProfiles([]);
      });
  }, [user, logout, navigate]); // Re-fetch when user logs in or out

  const filteredProfiles = user
    ? profiles.filter((p) => p.email !== user.email)
    : profiles;

  const totalPages = Math.ceil(filteredProfiles.length / perPage);
  const currentProfiles = filteredProfiles.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="home-container">
      <Header />

      {user && (
        <section className="your-profile">
          <h2 className="section-title">👤 Your Profile</h2>
          <div className="your-profile-card">
            <ProfileCard profile={user} />
          </div>
        </section>
      )}

      <section className="all-profiles">
        <h2 className="section-title">🌍 Available Skill Swappers</h2>
        <div className="profile-list">
          {currentProfiles.length > 0 ? (
            currentProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%' }}>No public profiles found.</p>
          )}
        </div>
        {totalPages > 1 && (
          <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
        )}
      </section>
    </div>
  );
}

export default HomePage;