import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: "user", password: "user123" });

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await dispatch(login(form));

    if (login.fulfilled.match(result)) {
      navigate(result.payload.user.role === "admin" ? "/admin" : "/user");
    }
  }

  return (
    <section className="auth-panel">
      <h1>登录</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          用户名
          <input name="username" value={form.username} onChange={updateField} />
        </label>
        <label>
          密码
          <input name="password" type="password" value={form.password} onChange={updateField} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="button primary" disabled={loading}>
          {loading ? "登录中..." : "登录"}
        </button>
      </form>
      <p className="hint">
        没有账号？<Link to="/register">去注册</Link>
      </p>
    </section>
  );
}
