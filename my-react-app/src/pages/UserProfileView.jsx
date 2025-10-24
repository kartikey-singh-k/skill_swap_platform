import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Assuming this path is correct
import { useAuth } from "../auth"; // Assuming this path is correct

function UserProfileView() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {};

    // ✅ FIX: Only add the Authorization header if a token exists.
    // This allows guests to view public profiles as supported by the backend.
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`http://localhost:5000/api/users/${id}`, { headers })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          logout();
          navigate("/login");
          throw new Error('Session expired or unauthorized.');
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
        console.error("Failed to load profile:", err.message);
        setLoading(false);
      });
  }, [id, navigate, logout]);

  const handleRequest = () => {
    if (!user) {
      alert("Please login to send a request.");
      navigate("/login");
    } else {
      navigate(`/request/${id}`);
    }
  };
  
  const isOwnProfile = user && profile && user.id === profile.id;

  // ✅ FIX: The entire page is wrapped in a single, unstyled root div.
  // The <Header /> is now a sibling to the main content wrapper, fixing the layout bug.
  return (
    <div>
      <Header />

      {loading && <div style={{ padding: "2rem", textAlign: "center" }}>Loading profile...</div>}
      
      {!loading && !profile && <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>❌ Profile not found.</div>}

      {!loading && profile && (
        <div className="user-profile-view">
          {/* ✅ FIX: The JSX structure now perfectly matches the final CSS */}
          <div className="profile-container">
            <div className="profile-left">
              <div className="profile-image">👤</div>
              <h2 className="profile-name">{profile.name}</h2>
              <button
                onClick={handleRequest}
                className="request-btn"
                disabled={isOwnProfile}
                style={{
                  opacity: isOwnProfile ? 0.6 : 1,
                  cursor: isOwnProfile ? 'not-allowed' : 'pointer'
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
      )}
    </div>
  );
}

export default UserProfileView;
