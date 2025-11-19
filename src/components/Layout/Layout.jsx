import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function NavItem({ to, label, hotkey }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        ["sidebar-link", isActive ? "sidebar-link--active" : ""].join(" ")
      }
    >
      <span className="sidebar-link-label">
        <span className="sidebar-link-dot" />
        <span>{label}</span>
      </span>
      {hotkey && <span className="sidebar-link-key">{hotkey}</span>}
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-abbr">RM</div>
          <div className="sidebar-brand-title">Reels Manager</div>
          <div className="sidebar-brand-sub">Панель агентства</div>
        </div>

        <nav className="sidebar-menu">
          <NavItem to="/upload" label="Загрузка роликов" hotkey="U" />
          <NavItem to="/queue" label="Очередь постов" hotkey="Q" />
          <NavItem to="/accounts" label="Instagram аккаунты" hotkey="A" />
        </nav>

        <div className="sidebar-footer">
          {user && (
            <>
              <div className="sidebar-user-email">{user.email}</div>
              <div className="sidebar-user-role">Роль: {user.role}</div>
            </>
          )}
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={handleLogout}
            style={{ width: "100%" }}
          >
            Выйти
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div>
            <div className="topbar-title">Панель агентства</div>
            <div className="topbar-sub">
              Управляй аккаунтами, загрузкой рилсов и очередью постов
            </div>
          </div>
          <div className="topbar-right">
            <span className="text-muted">RM</span>
          </div>
        </header>

        <section className="page-container">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
