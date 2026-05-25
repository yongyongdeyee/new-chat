from app import app


def test_login_and_roles():
    client = app.test_client()

    user_login = client.post("/api/login", json={
        "username": "user",
        "password": "user123",
    })
    assert user_login.status_code == 200
    user_token = user_login.get_json()["token"]

    user_profile = client.get(
        "/api/user/profile",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert user_profile.status_code == 200

    blocked_admin = client.get(
        "/api/admin/dashboard",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert blocked_admin.status_code == 403

    admin_login = client.post("/api/login", json={
        "username": "admin",
        "password": "admin123",
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.get_json()["token"]

    admin_dashboard = client.get(
        "/api/admin/dashboard",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert admin_dashboard.status_code == 200
    assert admin_dashboard.get_json()["total_users"] >= 2


if __name__ == "__main__":
    test_login_and_roles()
    print("backend api tests passed")
