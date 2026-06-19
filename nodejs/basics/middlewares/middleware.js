// Middleware is a function that executes between the request and the response.
// It has access to:
// req (request)
// res (response)
// next (function to pass control to the next middleware)

//2
// Middleware is a function in Express that executes between the incoming request and 
// the final response. It has access to req, res, and next. Middleware is commonly used for
//  logging, authentication, authorization, validation, error handling, and
//  request processing. Calling next() passes control to the next middleware or route handler.

const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("Request received");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000);

//next() -> Pass control to the next middleware or route handler."

// What if we don't call next()?
// app.use((req, res, next) => {
//   console.log("Middleware");
// });

// Request will hang because Express doesn't know what to do next.

// You must either:

// next(); or res.end()

//common uses of middleware



// Common Uses of Middleware
// 1. Logging
// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });

// Example output:

// GET /users
// POST /login
// 2. Authentication
// app.use((req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).send("Unauthorized");
//   }

//   next();
// });
// 3. Validation
// app.post("/users", (req, res, next) => {
//   if (!req.body.name) {
//     return res.status(400).send("Name required");
//   }

//   next();
// });
// 4. Parsing JSON

// Built-in Express middleware:

// app.use(express.json());

// Converts:

// {
//   "name": "Aravinth"
// }

// into:

// Custom Middleware Example
// function logger(req, res, next) {
//   console.log(`${req.method} ${req.url}`);
//   next();
// }

// app.use(logger);


// Route-Level Middleware

// Runs only for specific routes.

// function auth(req, res, next) {
//   console.log("Checking user");
//   next();
// }

// app.get("/profile", auth, (req, res) => {
//   res.send("Profile Page");
// });

// Request
//    ↓
// JWT Authentication Middleware
//    ↓
// Role Permission Middleware
//    ↓
// Validation Middleware
//    ↓
// Controller
//    ↓
// Response


// app.post(
//   "/purchase-order",
//   verifyToken,
//   checkRole,
//   validatePO,
//   createPO
// );