import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    availability: "",
    profile_type: "Public",
    skills_offered: "",
    skills_wanted: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    // ✅ Basic validation
    const requiredFields = ["name", "email", "password"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`⚠️ Please fill out the ${field} field.`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills_offered: formData.skills_offered.split(",").map(s => s.trim()),
          skills_wanted: formData.skills_wanted.split(",").map(s => s.trim())
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "❌ Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ Server error. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="register">
      <div className="register__box">
        <h2 className="register__title">Create Your Account</h2>

        <div className="register__form">
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} />

          <label>Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} />

          <label>Password</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} />

          <label>Location</label>
          <input name="location" value={formData.location} onChange={handleChange} />

          <label>Availability</label>
          <input name="availability" value={formData.availability} onChange={handleChange} />

          <label>Profile Type</label>
          <select name="profile_type" value={formData.profile_type} onChange={handleChange}>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>

          <label>Skills Offered (comma-separated)</label>
          <input name="skills_offered" value={formData.skills_offered} onChange={handleChange} />

          <label>Skills Wanted (comma-separated)</label>
          <input name="skills_wanted" value={formData.skills_wanted} onChange={handleChange} />

          <button className="register__button" onClick={handleRegister} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
