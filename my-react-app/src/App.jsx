import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import SwapRequestPage from "./pages/SwapRequestPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import { AuthProvider } from "./auth";
import UserProfileView from "./pages/UserProfileView";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/swap-requests" element={<SwapRequestPage />} />
          <Route path="/request/:id" element={<RequestDetailsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/user/:id" element={<UserProfileView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
