// server.js
import express from "express";
import crypto from "crypto";
import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  })
);

app.use(express.json());

// In-memory storage
const users = {};
const todos = {};

// Extract token from Authorization header
const extractToken = (authHeader) =>
  authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

const findUserByToken = (token) =>
  Object.values(users).find((u) => u.token === token);

const authenticateUser = (req, res, next) => {
  const token = extractToken(req.headers.authorization);
  if (!token || !findUserByToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Register user
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ error: "Username exists" });

  const token = crypto.randomBytes(32).toString("hex");
  users[username] = { username, password, token, id: Object.keys(users).length + 1 };
  todos[username] = [];
  res.status(201).json({ id: users[username].id, username, token });
});

// Login user
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ id: user.id, username, token: user.token });
});

// Logout user
app.post("/logout", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  if (user) {
    user.token = crypto.randomBytes(32).toString("hex"); // invalidate old token
    res.json({ message: "Logged out successfully" });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Create todo
app.post("/todos", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  const { title, description } = req.body;
  const newTodo = {
    id: crypto.randomBytes(16).toString("hex"),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos[user.username].push(newTodo);
  res.status(201).json(newTodo);
});

// Get all todos
app.get("/todos", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  res.json(todos[user.username]);
});

// Update todo
app.put("/todos/:id", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  const todoId = req.params.id;
  const { title, description, completed } = req.body;

  const todoToUpdate = todos[user.username].find((todo) => todo.id === todoId);
  if (!todoToUpdate) return res.status(404).json({ error: "Todo not found" });

  todoToUpdate.title = title || todoToUpdate.title;
  todoToUpdate.description = description || todoToUpdate.description;
  todoToUpdate.completed = completed !== undefined ? completed : todoToUpdate.completed;

  res.json(todoToUpdate);
});

// Delete todo
app.delete("/todos/:id", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  const todoId = req.params.id;
  const todoIndex = todos[user.username].findIndex((todo) => todo.id === todoId);

  if (todoIndex === -1) return res.status(404).json({ error: "Todo not found" });

  todos[user.username].splice(todoIndex, 1);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});