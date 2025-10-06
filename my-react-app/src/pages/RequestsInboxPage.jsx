import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../auth";

function RequestsInboxPage() {
  const [requests, setRequests] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem("token");

    // Only proceed if the user and token exist
    if (user && token) {
      fetch("http://localhost:5000/api/requests/received", {
        headers: {
          // 2. Add the Authorization header to the request
          "Authorization": `Bearer ${token}` 
        }
      })
      .then(res => {
        // 3. Handle session expired errors
        if (res.status === 401 || res.status === 403) {
          logout();
          navigate('/login');
          throw new Error('Session expired. Please log in again.');
        }
        return res.json();
      })
      .then(data => {
        if (data.success && Array.isArray(data.requests)) {
          setRequests(data.requests);
        }
      })
      .catch(err => console.error("Failed to fetch requests:", err.message));
    }
  }, [user, navigate, logout]); // Add dependencies for hooks

  const handleAccept = (requestId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        logout();
        navigate('/login');
        return;
    }

    fetch(`http://localhost:5000/api/requests/${requestId}/accept`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}` // Also add the token here
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Update the status of the request in the UI
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === requestId ? { ...req, status: 'accepted' } : req
          )
        );
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="inbox-container" style={{ padding: '2rem' }}>
        <h2>Your Skill Swap Requests</h2>
        {requests.length === 0 ? (
          <p>You have no new requests.</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className="request-card" style={{ background: '#fff', padding: '1rem', margin: '1rem 0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p><strong>From:</strong> {req.sender_name}</p>
              <p><strong>They Offer:</strong> {req.skill_offered}</p>
              <p><strong>They Want:</strong> {req.skill_wanted}</p>
              <p><strong>Message:</strong> "{req.message}"</p>
              <p><strong>Status:</strong> <span style={{ fontWeight: 'bold' }}>{req.status}</span></p>
              {req.status === 'pending' && (
                <button onClick={() => handleAccept(req.id)} style={{ padding: '8px 12px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Accept
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RequestsInboxPage;