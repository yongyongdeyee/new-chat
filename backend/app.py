from datetime import datetime, timedelta, timezone

from functools import wraps

import jwt
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash

from database import create_user, find_user_by_username, init_db, list_users


app = Flask(__name__)
CORS(app)

SECRET_KEY = "change-this-secret-key"
init_db()


def public_user(user):
    return {
        "id": user["id"],
        "username": user["username"],
        "role": user["role"],
    }


def create_token(user):
    payload = {
        "sub": user["username"],
        "role": user["role"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=2),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def auth_required(required_role=None):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")

            if not auth_header.startswith("Bearer "):
                return jsonify({"message": "Missing token"}), 401

            token = auth_header.replace("Bearer ", "", 1)

            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"message": "Invalid token"}), 401

            user = find_user_by_username(payload["sub"])
            if not user:
                return jsonify({"message": "User not found"}), 401

            if required_role and user["role"] != required_role:
                return jsonify({"message": "Permission denied"}), 403

            request.current_user = user
            return view_func(*args, **kwargs)

        return wrapper

    return decorator


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/register")
def register():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    if find_user_by_username(username):
        return jsonify({"message": "Username already exists"}), 409

    user = create_user(username, password)

    return jsonify({"user": public_user(user)}), 201


@app.post("/api/login")
def login():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    user = find_user_by_username(username)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"message": "Invalid username or password"}), 401

    return jsonify({
        "token": create_token(user),
        "user": public_user(user),
    })


@app.get("/api/me")
@auth_required()
def me():
    return jsonify({"user": public_user(request.current_user)})


@app.get("/api/user/profile")
@auth_required()
def user_profile():
    return jsonify({
        "message": "普通用户和管理员都可以看到这里。",
        "user": public_user(request.current_user),
    })


@app.get("/api/admin/dashboard")
@auth_required(required_role="admin")
def admin_dashboard():
    all_users = list_users()

    return jsonify({
        "message": "只有管理员可以看到这里。",
        "total_users": len(all_users),
        "users": [public_user(user) for user in all_users],
    })


if __name__ == "__main__":
    app.run(debug=True)
