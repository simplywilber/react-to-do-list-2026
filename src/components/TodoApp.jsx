import { useState, useEffect } from "react";

export default function TodoApp({ token, logout }) {
  const [todos, setTodos] = useState([]);
  const [note, setNote] = useState("");

  // Fetch todos
  useEffect(() => {
    const loadTodos = async () => {
      try {
        if (!token) return;
        const res = await fetch("http://localhost:3000/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(() => {
      loadTodos();
    }, 0);

    return () => clearTimeout(timer);
  }, [token]);

  const fetchTodos = async () => {
    try {
      if (!token) return;
      const res = await fetch("http://localhost:3000/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    try {
      await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: note, description: "" }),
      });
      setNote("");
      await fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });
      await fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const editTodo = async (id, newNote) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newNote, description: "" }),
      });
      await fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="todoContainer">
      <div id="todoHeader">
        <h1>Your Todos</h1>
        <button id="logoutBtn" onClick={logout}>Logout</button>
      </div>

      <form id="todoForm" onSubmit={createTodo}>
        <input
          type="text"
          placeholder="Enter note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>

      {todos.length > 0 && (
        <ul id="todoList">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TodoItem({ todo, toggleComplete, deleteTodo, editTodo }) {
  const [editMode, setEditMode] = useState(false);
  const [note, setNote] = useState(todo.title);

  useEffect(() => {
    const timer = setTimeout(() => setNote(todo.title), 0);
    return () => clearTimeout(timer);
  }, [todo.title]);

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