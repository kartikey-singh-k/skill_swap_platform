import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import Pagination from "../components/Pagination";
import { useAuth } from "../auth";

function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error("❌ Failed to load profiles:", err));
  }, []);

  const filteredProfiles = user
    ? profiles.filter((p) => p.email !== user.email)
    : profiles;

  const totalPages = Math.ceil(filteredProfiles.length / perPage);
  const currentProfiles = filteredProfiles.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div>
      <Header />

      {user && (
        <div className="user-profile-section" style={{ padding: "2rem", backgroundColor: "#f4f4f4" }}>
          <h2>Your Profile</h2>
          <ProfileCard profile={user} />
        </div>
      )}

      <div className="profile-list">
        {currentProfiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
    </div>
  );
}

export default HomePage;
