import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../features/auth/authSlice.js";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: "", password: "" });
  const [success, setSuccess] = useState("");

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await dispatch(register(form));

    if (register.fulfilled.match(result)) {
      setSuccess("注册成功，现在可以登录。");
      setTimeout(() => navigate("/login"), 800);
    }
  }

  return (
    <section className="auth-panel">
      <h1>注册</h1>
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
        {success && <p className="success">{success}</p>}
        <button className="button primary" disabled={loading}>
          {loading ? "注册中..." : "注册"}
        </button>
      </form>
      <p className="hint">
        已有账号？<Link to="/login">去登录</Link>
      </p>
    </section>
  );
}
