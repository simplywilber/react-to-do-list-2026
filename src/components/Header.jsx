import React from "react";

export default function Header({ logout }) {
  return (
    <div id="todoHeader">
      <h1>Your Todos</h1>
      <button id="logoutBtn" onClick={logout}>Logout</button>
    </div>
  );
}