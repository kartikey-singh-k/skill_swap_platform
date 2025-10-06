import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../auth";

function UserProfile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Initialize state safely, checking if the user exists first.
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.location || "",
    availability: user?.availability || "",
    profile_type: user?.profile_type || "Public",
    skills_offered: (user?.skills_offered || []).join(", "),
    skills_wanted: (user?.skills_wanted || []).join(", ")
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("token"); // 1. Get the token

    if (!token) {
      alert("Session expired. Please log in again.");
      logout();
      navigate('/login');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 2. Add the Authorization header
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          skills_offered: formData.skills_offered.split(",").map((s) => s.trim()),
          skills_wanted: formData.skills_wanted.split(",").map((s) => s.trim())
        })
      });
      
      if (res.status === 401 || res.status === 403) {
        logout();
        navigate("/login");
        throw new Error("Session expired. Please log in again.");
      }

      const data = await res.json();
      if (data.success) {
        alert("✅ Profile updated successfully.");
        updateUser(data.user); // update context
      } else {
        alert(data.message || "❌ Update failed.");
      }
    } catch (err) {
      console.error("Update failed", err);
      alert(`❌ ${err.message || 'Server error.'}`);
    }
    setIsSaving(false);
  };

  if (!user) {
    return (
      <div>
        <Header />
        <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>
          <h2>❌ User not found.</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="profile-edit-container">
        <div className="profile-edit-card">
          <div className="profile-edit-left">
            <h2>Edit Your Profile</h2>

            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="readonly-input"
            />

            <label htmlFor="location">Location</label>
            <input id="location" name="location" value={formData.location} onChange={handleChange} />

            <label htmlFor="availability">Availability</label>
            <input id="availability" name="availability" value={formData.availability} onChange={handleChange} />

            <label htmlFor="profile_type">Profile Type</label>
            <select id="profile_type" name="profile_type" value={formData.profile_type} onChange={handleChange}>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>

            <label htmlFor="skills_offered">Skills Offered (comma-separated)</label>
            <input
              id="skills_offered"
              name="skills_offered"
              value={formData.skills_offered}
              onChange={handleChange}
            />

            <label htmlFor="skills_wanted">Skills Wanted (comma-separated)</label>
            <input
              id="skills_wanted"
              name="skills_wanted"
              value={formData.skills_wanted}
              onChange={handleChange}
            />
          </div>

          <div className="profile-edit-right">
            <div className="profile-photo-placeholder">Profile Photo</div>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
