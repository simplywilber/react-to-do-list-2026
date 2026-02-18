import React, { useState, useEffect } from "react";

export default function AuthForm({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
    if (savedToken) {
      // Defer setToken to next tick
      const timer = setTimeout(() => setToken(savedToken), 0);
      return () => clearTimeout(timer);
    }
  }, [setToken]);

  function setCookie(name, value, days = 1) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const endpoint = isLogin ? "login" : "register";
      const res = await fetch(`http://localhost:3000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      // Set cookie and update parent token
      setCookie("authToken", data.token);
      // Defer setToken to avoid synchronous state update
      setTimeout(() => setToken(data.token), 0);
    } catch {
      setError("Network error. Try again.");
    }
  };

  return (
    <div className="authContainer">
      <form onSubmit={handleSubmit}>
        <h1>{isLogin ? "Login" : "Register"}</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
        {error && <div className="error">{error}</div>}
      </form>

      <div className="options">
        <div><p>Already have an account?</p><span onClick={() => setIsLogin(true)}>Login</span></div>
        <div><p>Don't have an account?</p><span onClick={() => setIsLogin(false)}>Register</span></div>
      </div>
    </div>
  );
}