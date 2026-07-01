import { useState, useEffect } from "react";
import { getAdminPrograms, updateAdminProgram, createAdminProgram, deleteAdminProgram, getDirectorates } from "../../api";

const inputStyle = { width: "100%", padding: "0.65rem 0.75rem", border: "1.5px solid #dde2e8", borderRadius: "8px", fontSize: "1rem", boxSizing: "border-box" };
const labelStyle = { display: "block", marginBottom: "0.35rem", fontWeight: "600", fontSize: "0.9rem", color: "#444" };

export default function ProgramsList() {
  const [programs, setPrograms] = useState([]);
  const [directorates, setDirectorates] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', directorate: '', maleSeats: 0, femaleSeats: 0, status: 'open' });

  useEffect(() => {
    fetchPrograms();
    getDirectorates().then(setDirectorates).catch(console.error);
  }, []);

  const fetchPrograms = () => getAdminPrograms().then(setPrograms).catch(console.error);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', directorate: directorates[0] || '', maleSeats: 0, femaleSeats: 0, status: 'open' });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (prog) => {
    setFormData({ name: prog.Program_Name, directorate: prog.Directorate, maleSeats: prog.Male_Seats, femaleSeats: prog.Female_Seats, status: prog.Program_Status });
    setEditingId(prog.Program_ID);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateAdminProgram(editingId, formData);
      } else {
        await createAdminProgram(formData);
      }
      fetchPrograms();
      resetForm();
    } catch (err) {
      alert("حدث خطأ، يرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا البرنامج؟")) return;
    try {
      await deleteAdminProgram(id);
      fetchPrograms();
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ أثناء الحذف.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateAdminProgram(id, { status: currentStatus === 'open' ? 'closed' : 'open' });
      fetchPrograms();
    } catch (err) {
      alert("حدث خطأ أثناء التحديث");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>إدارة البرامج</h1>
        <button
          onClick={() => showAddForm ? resetForm() : (() => { setFormData(p => ({ ...p, directorate: directorates[0] || '' })); setShowAddForm(true); })()}
          style={{
            padding: "0.65rem 1.25rem",
            backgroundColor: showAddForm ? "#6c757d" : "#1e2a3a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.95rem",
          }}
        >
          {showAddForm ? '✖ إلغاء' : '➕ إضافة برنامج جديد'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 16px rgba(67,97,238,0.12)", padding: "1.75rem", marginBottom: "2rem", border: "2px solid #4361ee22" }}>
          <h2 style={{ margin: "0 0 1.25rem", color: "#1e2a3a", fontSize: "1.05rem" }}>
            {editingId ? '✏️ تعديل بيانات البرنامج' : '➕ إضافة برنامج جديد'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>اسم البرنامج</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={inputStyle} placeholder="مثال: دورة أساسيات الحاسوب" />
            </div>
            <div>
              <label style={labelStyle}>المديرية</label>
              <select name="directorate" value={formData.directorate} onChange={handleInputChange} required style={inputStyle}>
                <option value="">-- اختر المديرية --</option>
                {directorates.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>عدد مقاعد الذكور</label>
              <input type="number" name="maleSeats" value={formData.maleSeats} onChange={handleInputChange} min="0" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>عدد مقاعد الإناث</label>
              <input type="number" name="femaleSeats" value={formData.femaleSeats} onChange={handleInputChange} min="0" required style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button type="submit" disabled={saving} style={{
                padding: "0.7rem 2rem",
                backgroundColor: saving ? "#aaa" : "#1e2a3a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
              }}>
                {saving ? "جاري الحفظ..." : "💾 حفظ"}
              </button>
              <button type="button" onClick={resetForm} style={{ padding: "0.7rem 1.5rem", backgroundColor: "#f3f4f6", color: "#333", border: "1px solid #dde2e8", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", minWidth: "900px" }}>
          <thead style={{ backgroundColor: "#1e2a3a", color: "#fff" }}>
            <tr>
              {["البرنامج", "المديرية", "مقاعد ذكور", "مقاعد إناث", "مسجلين (ذ/إ)", "الحالة", "إجراءات"].map(h => (
                <th key={h} style={{ padding: "0.85rem 1rem", fontWeight: "bold", fontSize: "0.85rem" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: "2rem", textAlign: "center", color: "#6c757d" }}>لا يوجد برامج. أضف برنامجاً من الأعلى.</td></tr>
            ) : programs.map((prog, i) => (
              <tr key={prog.Program_ID} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{prog.Program_Name}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee" }}>{prog.Directorate}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee", textAlign: "center" }}>{prog.Male_Seats}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee", textAlign: "center" }}>{prog.Female_Seats}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee", textAlign: "center" }}>
                  <span style={{ color: "#2563eb" }}>{prog.Current_Male_Count}</span>
                  <span style={{ color: "#6c757d" }}> / </span>
                  <span style={{ color: "#be185d" }}>{prog.Current_Female_Count}</span>
                </td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee" }}>
                  <span style={{ padding: "0.25rem 0.65rem", borderRadius: "12px", fontSize: "0.8rem", backgroundColor: prog.Program_Status === 'open' ? "#dcfce7" : "#fee2e2", color: prog.Program_Status === 'open' ? "#166534" : "#dc2626", fontWeight: "bold" }}>
                    {prog.Program_Status === 'open' ? 'مفتوح' : 'مغلق'}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee" }}>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    <button onClick={() => toggleStatus(prog.Program_ID, prog.Program_Status)} style={{ padding: "0.3rem 0.6rem", cursor: "pointer", backgroundColor: prog.Program_Status === 'open' ? "#fef3c7" : "#dcfce7", color: prog.Program_Status === 'open' ? "#92400e" : "#166534", border: `1px solid ${prog.Program_Status === 'open' ? '#fcd34d' : '#86efac'}`, borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" }}>
                      {prog.Program_Status === 'open' ? '🔒 إغلاق' : '🔓 فتح'}
                    </button>
                    <button onClick={() => handleEdit(prog)} style={{ padding: "0.3rem 0.6rem", cursor: "pointer", backgroundColor: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" }}>
                      ✏️ تعديل
                    </button>
                    <button onClick={() => handleDelete(prog.Program_ID)} style={{ padding: "0.3rem 0.6rem", cursor: "pointer", backgroundColor: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" }}>
                      🗑️ حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: "0.75rem", color: "#6c757d", fontSize: "0.85rem" }}>إجمالي البرامج: {programs.length}</p>
    </div>
  );
}
