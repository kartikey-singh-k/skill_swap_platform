import React from "react";
import Header from "../components/Header";
import { useAuth } from "../auth";

function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div>
        <Header />
        <div style={{ padding: "2rem", color: "red" }}>❌ User not found. Please login.</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="profile-edit">
        <div className="profile-left">
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.location || "Not specified"}</p>
          <p><strong>Availability:</strong> {user.availability || "Unknown"}</p>
          <p><strong>Profile:</strong> {user.profile_type || "Public"}</p>

          <p><strong>Skills Offered:</strong></p>
          <ul>
            {(user.skills_offered || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <p><strong>Skills Wanted:</strong></p>
          <ul>
            {(user.skills_wanted || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="profile-right">
          <div className="profile-photo-large">Profile Photo</div>
          <button>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
