import React from "react";
import Login from "./Login";
import Homepage from "./homepage";
function App() {
  function handleLogin(data) {
    // You can send this to the backend or just log it
    console.log("Logging in with:", data);
    // Call fetch or axios here
  }

  return (
    <div>
      <Login onLogin={handleLogin} />
      <Homepage/>
    </div>
  );
}

export default App;
