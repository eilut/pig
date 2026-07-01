import { useState, useEffect } from "react";
import { getDirectorates, createAdminDirectorate, deleteAdminDirectorate } from "../../api";

export default function DirectoratesList() {
  const [directorates, setDirectorates] = useState([]);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchDirectorates(); }, []);

  const fetchDirectorates = () => {
    getDirectorates().then(setDirectorates).catch(console.error);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await createAdminDirectorate(newName.trim());
      setNewName('');
      fetchDirectorates();
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ أثناء الإضافة.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`هل أنت متأكد من حذف مديرية "${name}"؟`)) return;
    try {
      await deleteAdminDirectorate(name);
      fetchDirectorates();
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ أثناء الحذف.");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>إدارة المديريات</h1>

      {/* Add Form */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "1.5rem",
        marginBottom: "2rem",
      }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.05rem" }}>➕ إضافة مديرية جديدة</h2>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", fontWeight: "600", color: "#444" }}>
              اسم المديرية
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="مثال: مديرية الوهيجة"
              required
              style={{
                width: "100%",
                padding: "0.65rem 0.75rem",
                border: "1.5px solid #dde2e8",
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button type="submit" disabled={adding} style={{
            padding: "0.65rem 1.5rem",
            backgroundColor: adding ? "#aaa" : "#1e2a3a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: adding ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            height: "42px",
          }}>
            {adding ? "جاري الحفظ..." : "💾 حفظ"}
          </button>
        </form>
      </div>

      {/* List */}
      <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
          <thead style={{ backgroundColor: "#1e2a3a", color: "#fff" }}>
            <tr>
              <th style={{ padding: "0.85rem 1rem", fontWeight: "bold", fontSize: "0.85rem" }}>#</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: "bold", fontSize: "0.85rem" }}>اسم المديرية</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: "bold", fontSize: "0.85rem", width: "130px" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {directorates.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ padding: "2rem", textAlign: "center", color: "#6c757d" }}>
                  لا توجد مديريات. أضف مديرية أعلاه.
                </td>
              </tr>
            ) : directorates.map((dir, i) => (
              <tr key={dir} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee", color: "#6c757d", fontSize: "0.85rem" }}>{i + 1}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee", fontWeight: "600" }}>{dir}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee" }}>
                  <button
                    onClick={() => handleDelete(dir)}
                    style={{
                      padding: "0.3rem 0.75rem",
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      border: "1px solid #fca5a5",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    🗑️ حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: "0.75rem", color: "#6c757d", fontSize: "0.85rem" }}>إجمالي المديريات: {directorates.length}</p>
    </div>
  );
}
