import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // context login stores user
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
        login(data.user); // save user in context + localStorage
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
        />
        <input
          className="login__input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login__button" onClick={handleLogin}>
          Login
        </button>

        <p className="login__footer">
          <span onClick={() => alert("Recovery not implemented yet.")}>
            Forgot password or username?
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
