import { useEffect, useState } from "react";
import api from "../api/client.js";

export default function AdminPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((response) => {
      setDashboard(response.data);
    });
  }, []);

  return (
    <section className="panel">
      <p className="eyebrow">管理后台</p>
      <h1>管理员面板</h1>
      <p className="lead">{dashboard?.message || "加载中..."}</p>

      {dashboard && (
        <div className="table-wrap">
          <p><strong>用户总数：</strong>{dashboard.total_users}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>权限</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.users.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.username}</td>
                  <td>{item.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
