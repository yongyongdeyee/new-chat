# Simple Personal Site Login System

这是一个适合学习的个人网站登录系统示例：

- 后端：Python + Flask
- 前端：React + Redux Toolkit + React Router
- 权限：普通用户 `user` 和管理员 `admin`
- 数据库：SQLite

## 项目结构

```text
backend/
  app.py
  database.py
  requirements.txt
frontend/
  package.json
  index.html
  src/
```

## 启动后端

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

后端默认运行在 `http://127.0.0.1:5000`。

首次启动后会自动创建 `backend/site.db`，并写入两个学习用账号。

内置账号：

| 用户名 | 密码 | 权限 |
| --- | --- | --- |
| admin | admin123 | admin |
| user | user123 | user |

## 启动前端

另开一个终端：

```powershell
cd frontend
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`。

## 可学习的重点

- Flask 如何写 API
- 密码如何用 hash 保存
- JWT 如何表达登录状态
- React 组件如何拆分
- Redux 如何保存当前用户和 token
- 如何根据角色限制页面访问
