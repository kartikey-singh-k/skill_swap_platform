import React, { useState } from "react";

import profiles from "./profile";

function SkillSwapPage() {
  return (
    <div className="page-container">
      <header className="header">
        <h1 className="title">Skill Swap Platform</h1>
        <button className="login-button">Login</button>
      </header>

      <div className="search-bar">
        <select className="availability-select">
          <option value="">Availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <input className="search-input" placeholder="Search" />
        <button className="search-button">Search</button>
      </div>

      <div className="profile-list">
        {profiles.map((profile, index) => (
          <div key={index} className="profile-card">
            <div className="profile-photo">Profile Photo</div>
            <div className="profile-info">
              <h2 className="profile-name">{profile.name}</h2>
              <div className="skills-section">
                <span className="skills-title green">Skills Offered:</span>
                <div className="skills-tags">
                  {profile.skillsOffered.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skills-section">
                <span className="skills-title blue">Skill Wanted:</span>
                <div className="skills-tags">
                  {profile.skillsWanted.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="request-section">
              <button className="request-button">Request</button>
              <div className="rating">rating <strong>{profile.rating}/5</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillSwapPage;