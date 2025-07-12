import React from "react";
import { useParams } from "react-router-dom";

function RequestDetailsPage() {
  const { id } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Skill swap request submitted!");
  };

  return (
    <div className="request">
      <div className="request__card">
        <h2 className="request__title">Send Skill Swap Request</h2>
        <form className="request__form" onSubmit={handleSubmit}>
          <label className="request__label">Skill You Offer</label>
          <select className="request__select">
            <option>JavaScript</option>
            <option>Python</option>
            <option>UI/UX Design</option>
          </select>

          <label className="request__label">Skill You Want</label>
          <select className="request__select">
            <option>Graphic Design</option>
            <option>Marketing</option>
            <option>Data Analysis</option>
          </select>

          <label className="request__label">Message</label>
          <textarea
            className="request__textarea"
            rows="5"
            placeholder="Write a short message..."
          />

          <button type="submit" className="request__button">Submit Request</button>
        </form>
      </div>
    </div>
  );
}

export default RequestDetailsPage;
