const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Read config
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const decodedUsername = Buffer.from(config.username, "base64").toString("utf-8");
const decodedPassword = Buffer.from(config.password, "base64").toString("utf-8");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // <-- needed for JSON API requests
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Root route → login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === decodedUsername && password === decodedPassword) {
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect("/dashboard");
  } else {
    res.redirect("/login.html?error=1");
  }
});

// Dashboard route
app.get("/dashboard", (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } else {
    res.redirect("/login.html");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// Block config.json
app.get("/config.json", (req, res) => {
  res.status(403).send("Access Denied");
});

// ---------------- API Routes ----------------

// Update water limit
app.post("/api/update-limit", (req, res) => {
  const { room, limit } = req.body;
  console.log(`Room ${room} limit: ${limit} L`);
  res.json({ success: true });
});

// Toggle room power
app.post("/api/control-room", (req, res) => {
  const { room, status } = req.body;
  console.log(`Room ${room} power: ${status}`);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
