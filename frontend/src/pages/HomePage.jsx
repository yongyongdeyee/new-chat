import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <section className="panel">
      <p className="eyebrow">Python + React + Redux</p>
      <h1>简单个人网站登录系统</h1>
      <p className="lead">
        这个示例把登录、注册、用户权限和管理员权限放在一个容易拆开的项目里。
      </p>

      {user ? (
        <div className="actions">
          <Link className="button primary" to="/user">进入用户中心</Link>
          {user.role === "admin" && <Link className="button" to="/admin">进入管理后台</Link>}
        </div>
      ) : (
        <div className="actions">
          <Link className="button primary" to="/login">登录</Link>
          <Link className="button" to="/register">注册</Link>
        </div>
      )}
    </section>
  );
}
