import React, { useState } from "react";
import { useAuth } from "../auth";

function SwapRequest({ recipient }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to send a request.");
      return;
    }

    if (!message.trim()) return;

    const payload = {
      fromUserId: user.id,
      toUserId: recipient.id,
      skillOffered: (user.skills_offered || [])[0] || "N/A",
      skillWanted: (recipient.skills_offered || [])[0] || "N/A",
      message,
    };

    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Request sent successfully!");
        setMessage("");
      } else {
        setStatus("❌ Failed to send request.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("❌ Server error.");
    }
  };

  return (
    <div className="swap-request-card">
      <h2 className="request-title">Send a Swap Request</h2>
      <p className="recipient-label">
        To: <strong>{recipient.name}</strong>
      </p>
      <form onSubmit={handleSubmit} className="request-form">
        <textarea
          placeholder="Write your request message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="request-message"
          required
        />
        <button type="submit" className="submit-request-button">
          Send Request
        </button>
        {status && <p style={{ marginTop: "10px", color: "green" }}>{status}</p>}
      </form>
    </div>
  );
}

export default SwapRequest;
