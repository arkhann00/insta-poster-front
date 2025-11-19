import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "../services/mockApi.js";

export default function DashboardLayout() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="nav">
      <aside className="sidebar">
        <h1>Reels Manager</h1>
        <div className="menu">
          <NavLink to="/queue">Очередь</NavLink>
          <NavLink to="/upload">Загрузка</NavLink>
          <NavLink to="/schedule">Планирование</NavLink>
          <NavLink to="/accounts">Аккаунты</NavLink>
          <NavLink to="/settings">Настройки</NavLink>
        </div>
        <div style={{ marginTop: 16, fontSize: 13, color: "var(--muted)" }}>
          Вошёл: <b>{user.email}</b> ({user.role})
        </div>
      </aside>
      <div>
        <div className="topbar">
          <div>Панель управления</div>
          <div className="right">
            <button className="ghost" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
