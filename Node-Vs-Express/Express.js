const express = require('express');
const app = express();

app.use(express.json());  // Body parser

let users = [
  { id: 1, name: "Aravinth" },
  { id: 2, name: "John" }
];

// GET /users -----------------------------------------
app.get('/users', (req, res) => {
  res.json(users);
});

// POST /users -----------------------------------------
app.post('/users', (req, res) => {
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT /users/:id ---------------------------------------
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  users = users.map(u => (u.id === id ? { ...u, ...req.body } : u));

  res.json({ message: "User updated" });
});

// DELETE /users/:id -------------------------------------
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);

  res.json({ message: "User deleted" });
});

// Server start ------------------------------------------
app.listen(3000, () => console.log("Server running on port 3000"));
