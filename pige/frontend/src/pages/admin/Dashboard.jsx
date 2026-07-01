import { useState, useEffect } from "react";
import { getAdminStats } from "../../api";
import { Link } from "react-router-dom";

const StatCard = ({ label, value, icon, color }) => (
  <div style={{
    padding: "1.5rem",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    borderRight: `4px solid ${color}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}>
    <div>
      <p style={{ margin: 0, color: "#6c757d", fontSize: "0.9rem" }}>{label}</p>
      <strong style={{ fontSize: "2.5rem", color, display: "block", marginTop: "0.25rem", lineHeight: 1 }}>{value}</strong>
    </div>
    <span style={{ fontSize: "2.5rem" }}>{icon}</span>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "0.5rem" }}>لوحة التحكم</h1>
      <p style={{ color: "#6c757d", marginBottom: "2rem" }}>مرحباً بك في لوحة إدارة منصة التسجيل</p>

      {!stats ? (
        <p style={{ color: "#6c757d" }}>جاري تحميل البيانات...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <StatCard label="إجمالي الطلاب المسجلين" value={stats.totalStudents} icon="👥" color="#4361ee" />
          <StatCard label="البرامج المتاحة للتسجيل" value={stats.openPrograms} icon="📂" color="#2ecc71" />
          <StatCard label="عمليات التسجيل اليوم" value={stats.todayOperations} icon="📅" color="#f39c12" />
        </div>
      )}

      <h2 style={{ marginBottom: "1rem" }}>الوصول السريع</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {[
          { to: "/admin/students", label: "سجل الطلاب", desc: "عرض جميع الطلاب المسجلين", icon: "📋" },
          { to: "/admin/programs", label: "إدارة البرامج", desc: "إضافة وتعديل وحذف البرامج", icon: "🗂️" },
          { to: "/admin/directorates", label: "إدارة المديريات", desc: "إضافة وحذف المديريات", icon: "🏢" },
        ].map(item => (
          <Link key={item.to} to={item.to} style={{ textDecoration: "none" }}>
            <div style={{
              padding: "1.5rem",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
            >
              <span style={{ fontSize: "2rem" }}>{item.icon}</span>
              <h3 style={{ margin: "0.5rem 0 0.25rem", color: "#333" }}>{item.label}</h3>
              <p style={{ margin: 0, color: "#6c757d", fontSize: "0.85rem" }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
