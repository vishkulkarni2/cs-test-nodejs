// Deliberately vulnerable file to verify PR review comments
const express = require("express");
const app = express();

// Hardcoded API key - should trigger finding
const STRIPE_KEY = "sk-test-FAKE-verify-pr-comments-1234567890abcdef";

// SQL injection via string concat
app.get("/search", (req, res) => {
  const query = "SELECT * FROM products WHERE name = '" + req.query.q + "'";
  db.query(query, (err, results) => res.json(results));
});

// Path traversal
app.get("/download", (req, res) => {
  const fs = require("fs");
  const content = fs.readFileSync("/files/" + req.params.file, "utf8");
  res.send(content);
});

// Open redirect
app.get("/go", (req, res) => {
  res.redirect(req.query.url);
});

app.listen(4000);
// verify-pr-1776130797
