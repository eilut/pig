import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await adminLogin(username, password);
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch (err) {
      setError("بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f7fa",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        padding: "2.5rem",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "3rem" }}>🛡️</span>
          <h1 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1.5rem" }}>لوحة الإدارة</h1>
          <p style={{ margin: 0, color: "#6c757d", fontSize: "0.9rem" }}>تسجيل دخول المشرفين</p>
        </div>

        {error && (
          <div style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#fff5f5",
            color: "#c0392b",
            border: "1px solid #f5c6cb",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.9rem", color: "#333" }}>
              اسم المستخدم
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="admin"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.9rem", color: "#333" }}>
              كلمة المرور
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.85rem",
              backgroundColor: loading ? "#aaa" : "#1e2a3a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </main>
  );
}
