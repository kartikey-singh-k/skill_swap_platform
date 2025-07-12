import React, { useState } from "react";

function SwapRequest({ recipient, onRequestSubmit }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onRequestSubmit({ recipient, message });
    setMessage("");
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
        />
        <button type="submit" className="submit-request-button">
          Send Request
        </button>
      </form>
    </div>
  );
}

export default SwapRequest;
