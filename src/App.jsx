import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import TodoApp from "./components/TodoApp";

export default function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (savedToken) {
      const timer = setTimeout(() => setToken(savedToken), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const logout = () => {
    // Remove token and reload
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken("");
  };

  return (
    <>
      {token ? <TodoApp token={token} logout={logout} /> : <AuthForm setToken={setToken} />}
    </>
  );
}