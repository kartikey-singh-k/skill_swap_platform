import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../auth";

function UserProfileView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile", err);
        setLoading(false);
      });
  }, [id]);

  const handleRequest = () => {
    if (!user) {
      alert("Please login to send a request.");
      navigate("/login");
    } else {
      navigate(`/request/${id}`);
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading profile...</div>;

  if (!profile) {
    return <div style={{ padding: "2rem", color: "red" }}>❌ Profile not found.</div>;
  }

  return (
    <div>
      <Header />
      <div className="profile-view">
        <div className="profile-view__content">
          <div className="profile-view__left">
            <button onClick={handleRequest} className="request-button">Request</button>
            <h2>{profile.name}</h2>
            <p><strong>Skills Offered:</strong> {(profile.skills_offered || []).join(", ")}</p>
            <p><strong>Skills Wanted:</strong> {(profile.skills_wanted || []).join(", ")}</p>
            <p><strong>Rating:</strong> {profile.rating || "N/A"}</p>
          </div>
          <div className="profile-view__right">
            <div className="profile-photo-large">Profile Photo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileView;
