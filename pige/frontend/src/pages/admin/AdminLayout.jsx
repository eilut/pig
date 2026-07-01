import { Navigate, Outlet, Link, useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "الرئيسية", icon: "🏠", exact: true },
  { to: "/admin/students", label: "سجل الطلاب", icon: "📋" },
  { to: "/admin/programs", label: "إدارة البرامج", icon: "🗂️" },
  { to: "/admin/directorates", label: "إدارة المديريات", icon: "🏢" },
];

export default function AdminLayout() {
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: "inherit" }}>
      <aside style={{
        width: "260px",
        backgroundColor: "#1e2a3a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <h2 style={{ margin: 0, color: "#fff", fontSize: "1.1rem" }}>🛡️ لوحة الإدارة</h2>
          <p style={{ margin: "0.25rem 0 0", color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>منصة تسجيل المستفيدين</p>
        </div>

        <nav style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                color: isActive(item.to, item.exact) ? "#fff" : "rgba(255,255,255,0.65)",
                backgroundColor: isActive(item.to, item.exact) ? "rgba(255,255,255,0.15)" : "transparent",
                fontWeight: isActive(item.to, item.exact) ? "bold" : "normal",
                transition: "all 0.15s",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Link to="/" style={{ display: "block", textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", padding: "0.5rem 1rem", marginBottom: "0.5rem" }}>
            ← العودة للموقع
          </Link>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              backgroundColor: "rgba(220,53,69,0.8)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.75rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
