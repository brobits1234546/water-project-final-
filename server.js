const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

const decodedUsername = Buffer.from(config.username, "base64").toString("utf-8");
const decodedPassword = Buffer.from(config.password, "base64").toString("utf-8");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
  })
);


// 

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



// 

app.get("/dashboard", (req, res) => {
  if (req.session.loggedIn) {
    // Send dashboard.html from public folder
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } else {
    res.redirect("/login.html"); // Redirect if not logged in
  }
});



app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// Block config.json from browser
app.get("/config.json", (req, res) => {
  res.status(403).send("Access Denied");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
