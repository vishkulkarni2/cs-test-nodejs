const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const app = express();

// SECRET in source code - hardcoded credential
const JWT_SECRET = "supersecret123";
const DB_PASSWORD = "admin123";
const API_KEY = "sk-proj-abcdef1234567890abcdef1234567890";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: DB_PASSWORD,
  database: "users"
});

app.use(express.json());

// SQL injection vulnerability
app.get("/user/:id", (req, res) => {
  const query = "SELECT * FROM users WHERE id = " + req.params.id;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

// Weak auth - == instead of ===
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username == "admin" && password == "admin") {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).send("Unauthorized");
  }
});

// JWT verification with no algorithm check - allows none algorithm bypass
app.get("/admin", (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["none", "HS256"] });
  res.json({ role: decoded.role });
});

// Path traversal vulnerability
app.get("/file", (req, res) => {
  const fs = require("fs");
  const filename = req.query.name;
  const content = fs.readFileSync("/uploads/" + filename, "utf8");
  res.send(content);
});

// Open redirect
app.get("/redirect", (req, res) => {
  res.redirect(req.query.url);
});

// Missing input validation - prototype pollution
app.post("/merge", (req, res) => {
  const target = {};
  const source = req.body;
  for (const key in source) {
    target[key] = source[key];
  }
  res.json(target);
});

// IDOR - no auth check on user data
app.get("/account/:userId", (req, res) => {
  db.query("SELECT * FROM accounts WHERE user_id = ?", [req.params.userId], (err, results) => {
    res.json(results);
  });
});

app.listen(3000);
// trigger scan - verify PR review comments
// trigger
