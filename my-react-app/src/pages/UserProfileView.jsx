import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import profiles from "../data/profiles";
import { useAuth } from "../auth";

function UserProfileView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const profile = profiles.find((p) => p.id === parseInt(id));

  const handleRequest = () => {
    if (!user) {
      alert("Please login to send a request.");
      navigate("/login");
    } else {
      navigate(`/request/${id}`);
    }
  };

  if (!profile) {
    return <div style={{ padding: "2rem" }}>❌ Profile not found.</div>;
  }

  return (
    <div>
      <Header />
      <div className="profile-view">
        <div className="profile-view__content">
          <div className="profile-view__left">
            <button onClick={handleRequest} className="request-button">Request</button>
            <h2>{profile.name}</h2>
            <p><strong>Skills Offered:</strong> {(profile.skillsOffered || []).join(", ")}</p>
            <p><strong>Skills Wanted:</strong> {(profile.skillsWanted || []).join(", ")}</p>
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
