import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/client.js";

export default function UserPage() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/user/profile").then((response) => {
      setProfile(response.data);
    });
  }, []);

  return (
    <section className="panel">
      <p className="eyebrow">用户中心</p>
      <h1>你好，{user.username}</h1>
      <div className="info-list">
        <p><strong>用户 ID：</strong>{user.id}</p>
        <p><strong>权限：</strong>{user.role}</p>
        <p><strong>后端消息：</strong>{profile?.message || "加载中..."}</p>
      </div>
    </section>
  );
}
