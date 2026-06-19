const http = require('http');

let users = [
  { id: 1, name: "Aravinth" },
  { id: 2, name: "John" }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // ❗ PROBLEM 1: No routing system → must manually check paths
  if (url === "/users" && method === "GET") {
    // ❗ PROBLEM 2: Must manually set headers every time
    res.writeHead(200, { "Content-Type": "application/json" });
    
    // ❗ PROBLEM 3: Must manually convert object to JSON each time
    return res.end(JSON.stringify(users));
  }

  // POST /users ----------------------------------------
  if (url === "/users" && method === "POST") {
    let body = "";

    // ❗ PROBLEM 4: Body parsing is manual
    // In Express → req.body works automatically
    req.on("data", chunk => { body += chunk });

    req.on("end", () => {
      // ❗ PROBLEM 5: Must manually handle JSON parse errors
      const data = JSON.parse(body);

      const newUser = { id: users.length + 1, ...data };
      users.push(newUser);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    });
    return;
  }

  // PUT /users/:id -------------------------------------
  if (url.startsWith("/users/") && method === "PUT") {
    // ❗ PROBLEM 6: Must manually extract params from URL
    // In Express → req.params.id
    const id = parseInt(url.split("/")[2]);

    let body = "";
    req.on("data", chunk => { body += chunk });

    req.on("end", () => {
      const data = JSON.parse(body);

      users = users.map(u => (u.id === id ? { ...u, ...data } : u));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User updated" }));
    });
    return;
    