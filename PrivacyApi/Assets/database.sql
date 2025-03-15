-- Users table stores basic user information and credentials
CREATE TABLE users
(
    user_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login    TIMESTAMP,
    paid          BOOLEAN   DEFAULT 0
);

CREATE INDEX idx_users_username ON users(username);