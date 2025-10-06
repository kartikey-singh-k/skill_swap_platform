import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

function RequestDetailsPage() {
  const { id: toUserId } = useParams(); // receiver's ID
  const { user } = useAuth();
  const navigate = useNavigate();

  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [message, setMessage] = useState("");

  // In src/pages/RequestDetailsPage.jsx

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    alert("Please login to send requests.");
    navigate("/login");
    return;
  }

  const token = localStorage.getItem("token"); // 1. Get the token from localStorage

  if (!token) {
    alert("Authentication error. Please login again.");
    navigate("/login");
    return;
  }

  const requestBody = {
    fromUserId: user.id,
    toUserId: parseInt(toUserId),
    skillOffered,
    skillWanted,
    message,
  };

  try {
    const response = await fetch("http://localhost:5000/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 2. Add the Authorization header to send the token
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Skill swap request submitted!");
      navigate("/");
    } else {
      alert(result.message || "❌ Failed to send request.");
    }
  } catch (err) {
    console.error("Error submitting request:", err);
    alert("Server error.");
  }
};

  return (
    <div className="request">
      <div className="request__card">
        <h2 className="request__title">Send Skill Swap Request</h2>
        <form className="request__form" onSubmit={handleSubmit}>
          <label className="request__label">Skill You Offer</label>
          <select className="request__select" value={skillOffered} onChange={(e) => setSkillOffered(e.target.value)} required>
            <option value="">--Select--</option>
            {(user?.skills_offered || []).map((skill, i) => (
              <option key={i} value={skill}>{skill}</option>
            ))}
          </select>

          <label className="request__label">Skill You Want</label>
          <select className="request__select" value={skillWanted} onChange={(e) => setSkillWanted(e.target.value)} required>
            <option value="">--Select--</option>
            {(user?.skills_wanted || []).map((skill, i) => (
              <option key={i} value={skill}>{skill}</option>
            ))}
          </select>

          <label className="request__label">Message</label>
          <textarea
            className="request__textarea"
            rows="5"
            placeholder="Write a short message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit" className="request__button">Submit Request</button>
        </form>
      </div>
    </div>
  );
}

export default RequestDetailsPage;
