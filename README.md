# CodeSheriff Test - Vulnerable Node.js API

This repo intentionally contains security vulnerabilities for testing CodeSheriff.

## Vulnerabilities included
- Hardcoded secrets (JWT secret, DB password, API key)
- SQL injection
- Weak authentication (loose equality)
- JWT none algorithm bypass
- Path traversal
- Open redirect
- Prototype pollution
- IDOR (insecure direct object reference)
