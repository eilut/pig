import { useState, useEffect } from "react";
import { getDirectorates } from "../api";
import { Link } from "react-router-dom";

export default function Home() {
  const [directorates, setDirectorates] = useState([]);
  const [loadingDirs, setLoadingDirs] = useState(true);

  useEffect(() => {
    getDirectorates()
      .then(setDirectorates)
      .catch(console.error)
      .finally(() => setLoadingDirs(false));
  }, []);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #1e2a3a 0%, #4361ee 100%)",
        color: "#fff",
        padding: "5rem 2rem",
        textAlign: "center",
      }}>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.95rem", opacity: 0.75, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          محافظة المحويت
        </p>
        <h1 style={{ margin: "0 0 1.25rem", fontSize: "2.2rem", fontWeight: "800", lineHeight: 1.3 }}>
          منصة تسجيل طلاب محافظة المحويت <br />للبرامج التدريبية
        </h1>
        <p style={{ margin: "0 0 2.5rem", opacity: 0.8, maxWidth: "560px", marginInline: "auto", lineHeight: 1.7 }}>
          مرحباً بكم. يمكنكم من خلال هذه المنصة الاطلاع على البرامج المتاحة في مديريتكم وحجز مقعدكم قبل اكتمال العدد.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register">
            <button style={{
              padding: "0.85rem 2.5rem",
              backgroundColor: "#fff",
              color: "#1e2a3a",
              border: "none",
              borderRadius: "50px",
              fontSize: "1.05rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}>
              🖊️ بدء التسجيل
            </button>
          </Link>
        </div>

        {/* Status Badge */}
        <div style={{ marginTop: "2.5rem" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "50px",
            padding: "0.5rem 1.25rem",
            fontSize: "0.9rem",
          }}>
            <span style={{ width: "8px", height: "8px", backgroundColor: "#4ade80", borderRadius: "50%", display: "inline-block" }}></span>
            التسجيل مفتوح الآن
          </span>
        </div>
      </section>

      {/* Cards */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>

        {/* Directorates */}
        <article style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", gridColumn: "1 / -1" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.05rem", color: "#1e2a3a" }}>🏢 المديريات المعتمدة للتسجيل</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {loadingDirs ? (
              <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>جاري التحميل...</span>
            ) : directorates.length === 0 ? (
              <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>لم يتم إضافة مديريات بعد</span>
            ) : directorates.map(d => (
              <span key={d} style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "0.35rem 0.85rem", fontSize: "0.9rem", fontWeight: "600" }}>
                {d}
              </span>
            ))}
          </div>
        </article>

        <article style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.05rem", color: "#1e2a3a" }}>📋 تعليمات هامة</h2>
          <ul style={{ margin: 0, paddingRight: "1.25rem", lineHeight: 2, color: "#444", fontSize: "0.95rem" }}>
            <li>يُسمح للمستفيد بالتسجيل في برنامج تدريبي واحد فقط.</li>
            <li>المقاعد محدودة وموزعة بناءً على الجنس.</li>
            <li>يُرجى تحري الدقة عند إدخال بياناتك الشخصية.</li>
          </ul>
        </article>

        <article style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.05rem", color: "#1e2a3a" }}>📞 الدعم الفني</h2>
          <p style={{ margin: 0, color: "#555", lineHeight: 1.8, fontSize: "0.95rem" }}>
            في حال واجهتك أي صعوبة أثناء عملية التسجيل أو كان لديك استفسار، يرجى التواصل مع الجهة المشرفة في مديريتك.
          </p>
        </article>

      </section>
    </main>
  );
}
