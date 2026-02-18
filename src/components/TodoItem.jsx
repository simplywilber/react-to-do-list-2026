import React, { useState } from "react";

export default function TodoItem({ todo, editTodo, toggleComplete, deleteTodo }) {
  const [editMode, setEditMode] = useState(false);
  const [note, setNote] = useState(todo.title);

  return (
    <li className={`todoItem ${todo.completed ? "completedItem" : ""}`}>
      <input
        type="text"
        value={note}
        disabled={!editMode}
        onChange={(e) => setNote(e.target.value)}
      />
      {!editMode ? (
        <button onClick={() => setEditMode(true)}>Edit</button>
      ) : (
        <button
          onClick={() => {
            editTodo(todo.id, note);
            setEditMode(false);
          }}
        >
          Save
        </button>
      )}
      <button onClick={() => toggleComplete(todo.id, !todo.completed)}>
        {todo.completed ? "Mark Pending" : "Mark Done"}
      </button>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
}