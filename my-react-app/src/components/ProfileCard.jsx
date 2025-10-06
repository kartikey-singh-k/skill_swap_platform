import React from "react";
import { useNavigate } from "react-router-dom";

function ProfileCard({ profile }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/${profile.id}`);
  };

  return (
    <div className="profile-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="profile-photo">Profile Photo</div>
      <div className="profile-info">
        <h2>{profile.name}</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Skills Offered:</strong> {(profile.skills_offered || []).join(", ")}</p>
        <p><strong>Skills Wanted:</strong> {(profile.skills_wanted || []).join(", ")}</p>
        <p><strong>Rating:</strong> {profile.rating || "N/A"}/5</p>
      </div>
    </div>
  );
}

export default ProfileCard;
