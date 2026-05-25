import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">个人网站</Link>
        <nav className="nav">
          <Link to="/">首页</Link>
          {user && <Link to="/user">用户中心</Link>}
          {user?.role === "admin" && <Link to="/admin">管理后台</Link>}
          {!user && <Link to="/login">登录</Link>}
          {!user && <Link to="/register">注册</Link>}
          {user && <button onClick={handleLogout}>退出</button>}
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
