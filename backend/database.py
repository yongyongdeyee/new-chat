import sqlite3
from pathlib import Path

from werkzeug.security import generate_password_hash

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "site.db"

def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('user', 'admin'))
            )
            """
        )
        seed_user(connection, "admin", "admin123", "admin")
        
        seed_user(connection, "user", "user123", "user")


def seed_user(connection, username, password, role):
    existing = connection.execute(
        "SELECT id FROM users WHERE username = ?",
        (username,),
    ).fetchone()

    if existing:
        return

    connection.execute(
        "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
        (username, generate_password_hash(password), role),
    )


def find_user_by_username(username):
    with get_connection() as connection:
        return connection.execute(
            "SELECT id, username, password_hash, role FROM users WHERE username = ?",
            (username,),
        ).fetchone()


def create_user(username, password):
    with get_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'user')",
            (username, generate_password_hash(password)),
        )
        return connection.execute(
            "SELECT id, username, password_hash, role FROM users WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()


def list_users():
    with get_connection() as connection:
        return connection.execute(
            "SELECT id, username, role FROM users ORDER BY id"
        ).fetchall()
