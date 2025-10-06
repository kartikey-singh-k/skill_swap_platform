import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../auth";

function UserProfileView() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // 1. Get the token

    if (token) {
      fetch(`http://localhost:5000/api/users/${id}`, {
        headers: {
          // 2. Add the Authorization header to the request
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((res) => {
        // 3. Handle session expired errors
        if (res.status === 401 || res.status === 403) {
          logout();
          navigate("/login");
          throw new Error('Session expired. Please log in again.');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile", err.message);
        setLoading(false);
      });
    } else {
      // If no token exists, the user isn't logged in.
      logout();
      navigate("/login");
    }
  }, [id, navigate, logout]);

  const handleRequest = () => {
    if (!user) {
      alert("Please login to send a request.");
      navigate("/login");
    } else {
      navigate(`/request/${id}`);
    }
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading profile...</div>;
  if (!profile) return <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>❌ Profile not found.</div>;

  const isOwnProfile = user && user.id === profile.id;

  return (
    <div className="user-profile-view">
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-left">
            <div className="profile-image">👤</div>
            <h2 className="profile-name">{profile.name}</h2>
            <button
              onClick={handleRequest}
              className="request-btn"
              disabled={isOwnProfile}
              style={{
                opacity: isOwnProfile ? 0.5 : 1,
                cursor: isOwnProfile ? "not-allowed" : "pointer",
              }}
            >
              {isOwnProfile ? "This is You" : "Send Request"}
            </button>
          </div>

          <div className="profile-right">
            <p><strong>📍 Location:</strong> {profile.location || "Not specified"}</p>
            <p><strong>✅ Availability:</strong> {profile.availability || "Unknown"}</p>
            <p><strong>💼 Skills Offered:</strong> {(profile.skills_offered || []).join(", ")}</p>
            <p><strong>🎯 Skills Wanted:</strong> {(profile.skills_wanted || []).join(", ")}</p>
            <p><strong>⭐ Rating:</strong> {profile.rating || "N/A"}</p>
            <p><strong>🔐 Profile Type:</strong> {profile.profile_type || "Public"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileView;