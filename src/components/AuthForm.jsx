import React, { useState } from "react";

export default function AuthForm({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setToken(data.token);
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="authContainer">
      <h1>{isLogin ? "Login" : "Register"}</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      {/* 🔽 AUTH TOGGLE SECTION */}
      <div className="options">
        {isLogin ? (
          <p>
            Don’t have an account?{" "}
            <span
              onClick={() => setIsLogin(false)}
              className="linkBtn"
            >
              Register
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span              onClick={() => setIsLogin(true)}
              className="linkBtn">Login</span>
          </p>
        )}
      </div>
    </div>
  );
}