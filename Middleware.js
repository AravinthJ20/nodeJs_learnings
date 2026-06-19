// app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
// Application-level middleware
// Router-level middleware
// Error-handling middleware
// Built-in middleware
// Third-party middleware


/**
 * 1️⃣ Built-in middleware
 */
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static("public")); // serve static files

/**
 * 2️⃣ Third-party middleware
 */
app.use(cors());         // enable CORS
app.use(morgan("dev"));  // request logger

/**
 * 3️⃣ Custom global middleware (inline)
 */
app.use((req, res, next) => {
  console.log("🌐 Global middleware - Time:", new Date().toISOString());
  req.requestId = Math.random().toString(36).slice(2); // modify req
  next(); // pass control
});

/**
 * 4️⃣ Custom named middleware (reusable)
 */
function auth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized" }); // end cycle
  }
  req.user = { id: 1, role: "admin" }; // modify req
  next();
}

/**
 * 5️⃣ Route-level middleware
 */
app.get("/public", (req, res) => {
  res.json({ message: "Public route", requestId: req.requestId });
});

app.get("/private", auth, (req, res) => {
  res.json({
    message: "Private route",
    user: req.user,
    requestId: req.requestId
  });
});

/**
 * 6️⃣ Async middleware (with error forwarding)
 */
app.get("/async-error", async (req, res, next) => {
  try {
    // simulate async failure
    await Promise.reject(new Error("Async failure"));
  } catch (err) {
    next(err); // forward to error middleware
  }
});

/**
 * 7️⃣ 404 handler (not found)
 */
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

/**
 * 8️⃣ Error-handling middleware (must be LAST)
 */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

