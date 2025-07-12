import React, { useState } from "react";

function Login(props) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setLoginData((prevData) => {
      return {
        ...prevData,
        [name]: value
      };
    });
  }

  function submitLogin(event) {
    event.preventDefault();

    // Pass data to parent or send API request
    props.onLogin(loginData);

    // Clear form after submit (optional)
    setLoginData({
      email: "",
      password: ""
    });
  }

  return (
    <div className="login-container">
      <form>
        <input
          name="email"
          type="email"
          value={loginData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button onClick={submitLogin}>Login</button>
      </form>
    </div>
  );
}

export default Login;
