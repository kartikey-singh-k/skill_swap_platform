import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      // ✅ FIX: Pass the token along with the user data to the login function.
      login(data.user, data.token);
      navigate("/");
    } else {
      alert(data.message || "Invalid credentials.");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Server error. Please try again later.");
  }
};

  return (
    <div className="login">
      <div className="login__box">
        <h2 className="login__title">Welcome Back</h2>
        <p className="login__subtitle">Please enter your credentials to log in</p>

        <input
          className="login__input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="login__input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login__button" onClick={handleLogin}>
          Login
        </button>

        <div className="login__links">
          <span
            className="login__link"
            onClick={() => navigate("/recover")}
          >
             Forgot password / username?
          </span>
          <span
            className="login__link"
            onClick={() => navigate("/register")}
          >
            New user? Register here
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
