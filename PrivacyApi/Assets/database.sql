-- Users table stores basic user information and credentials
CREATE TABLE users
(
    user_id       INTEGER PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login    TIMESTAMP,
    verified      BOOLEAN   DEFAULT 0,
    paid          BOOLEAN   DEFAULT 0
);

CREATE TABLE tokens
(
    token_id INTEGER PRIMARY KEY,
    user_id  INTEGER NOT NULL UNIQUE,
    token    TEXT    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE

);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_tokens_user_id ON tokens (user_id);