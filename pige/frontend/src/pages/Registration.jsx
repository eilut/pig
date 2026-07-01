import { useState, useEffect } from "react";
import { getDirectorates, getPrograms, registerStudent } from "../api";

export default function Registration() {
  const [directorates, setDirectorates] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedDirectorate, setSelectedDirectorate] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", idNumber: "", phoneNumber: "",
    birthDate: "", gender: "", qualification: "", programId: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getDirectorates().then(setDirectorates).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedDirectorate) {
      setPrograms([]);
      setFormData(prev => ({ ...prev, programId: "" }));
      getPrograms(selectedDirectorate).then(setPrograms).catch(console.error);
    }
  }, [selectedDirectorate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerStudent({ ...formData, directorate: selectedDirectorate });
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.error || "حدث خطأ غير متوقع";
      const errorMap = {
        "duplicate_id": "رقم البطاقة مسجل مسبقاً",
        "duplicate_phone": "رقم الهاتف مسجل مسبقاً",
        "program_full": "عذراً، المقاعد ممتلئة لهذا البرنامج",
        "program_closed": "هذا البرنامج مغلق حالياً",
        "program_not_found": "البرنامج غير موجود"
      };
      setError(errorMap[msg] || msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{
          textAlign: "center",
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "3rem 2rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          maxWidth: "480px",
          width: "100%",
        }}>
          <span style={{ fontSize: "4rem" }}>✅</span>
          <h2 style={{ margin: "1rem 0 0.5rem", color: "#155724" }}>تم التسجيل بنجاح!</h2>
          <p style={{ color: "#555", marginBottom: "2rem" }}>لقد تم تسجيل بياناتك بنجاح. سيتم التواصل معك لاحقاً.</p>
          <a href="/" style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            backgroundColor: "var(--primary, #4361ee)",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}>
            العودة للرئيسية
          </a>
        </div>
      </main>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "0.65rem 0.75rem",
    border: "1.5px solid #dde2e8",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#fafbfc",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.35rem",
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#444",
  };

  return (
    <main className="shell">
      <section style={{
        margin: "2rem auto",
        maxWidth: "720px",
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "2rem 2.5rem",
      }}>
        <h2 style={{ margin: "0 0 1.5rem", fontSize: "1.4rem" }}>📝 تسجيل مستفيد جديد</h2>

        {error && (
          <div style={{ padding: "0.85rem 1rem", backgroundColor: "#fff5f5", color: "#c0392b", border: "1px solid #f5c6cb", borderRadius: "8px", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

          <div>
            <label style={labelStyle}>المديرية</label>
            <select value={selectedDirectorate} onChange={(e) => setSelectedDirectorate(e.target.value)} required style={inputStyle}>
              <option value="">-- اختر المديرية --</option>
              {directorates.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {selectedDirectorate && (
            <div>
              <label style={labelStyle}>البرنامج التدريبي</label>
              <select name="programId" value={formData.programId} onChange={handleChange} required style={inputStyle}>
                <option value="">-- اختر البرنامج --</option>
                {programs.length === 0
                  ? <option disabled>لا توجد برامج متاحة في هذه المديرية</option>
                  : programs.map(p => (
                    <option key={p.id} value={p.id} disabled={p.maleSeatsRemaining === 0 && p.femaleSeatsRemaining === 0}>
                      {p.name}{(p.maleSeatsRemaining === 0 && p.femaleSeatsRemaining === 0) ? ' — مكتملة' : ''}
                    </option>
                  ))
                }
              </select>
            </div>
          )}

          {formData.programId && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>الاسم الرباعي</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={inputStyle} placeholder="أدخل الاسم الرباعي" />
                </div>
                <div>
                  <label style={labelStyle}>رقم البطاقة الشخصية</label>
                  <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required style={inputStyle} placeholder="رقم الهوية" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>رقم الهاتف</label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={inputStyle} placeholder="07X XXXX XXX" />
                </div>
                <div>
                  <label style={labelStyle}>تاريخ الميلاد</label>
                  <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>الجنس</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required style={inputStyle}>
                    <option value="">-- اختر --</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>المؤهل العلمي</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required style={inputStyle} placeholder="مثال: ثانوي، جامعي" />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                marginTop: "0.5rem",
                padding: "0.85rem",
                backgroundColor: loading ? "#aaa" : "var(--primary, #4361ee)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                width: "100%",
              }}>
                {loading ? "جاري الإرسال..." : "إرسال طلب التسجيل"}
              </button>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
