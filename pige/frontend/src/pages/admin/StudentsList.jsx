import { useState, useEffect } from "react";
import { getAdminStudents } from "../../api";
import * as XLSX from "xlsx";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminStudents().then(setStudents).catch(console.error);
  }, []);

  const filtered = students.filter(s =>
    s.Full_Name?.includes(search) ||
    s.ID_Number?.includes(search) ||
    s.Directorate?.includes(search) ||
    s.Program_Name?.includes(search)
  );

  const exportToExcel = () => {
    const data = filtered.map(s => ({
      "الاسم": s.Full_Name,
      "رقم البطاقة": s.ID_Number,
      "رقم الهاتف": s.Phone_Number,
      "الجنس": s.Gender === "male" ? "ذكر" : "أنثى",
      "تاريخ الميلاد": s.Birth_Date ? new Date(s.Birth_Date).toLocaleDateString("ar-EG") : "",
      "المؤهل": s.Qualification,
      "المديرية": s.Directorate,
      "البرنامج": s.Program_Name,
      "تاريخ التسجيل": new Date(s.Registration_Date).toLocaleString("ar-EG"),
    }));
    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "الطلاب");
    XLSX.writeFile(wb, `students_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>سجل الطلاب</h1>
        <button onClick={exportToExcel} style={{
          padding: "0.6rem 1.25rem",
          backgroundColor: "#217346",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.95rem",
        }}>
          📥 حفظ كـ Excel
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 بحث بالاسم، رقم البطاقة، المديرية، أو البرنامج..."
          style={{
            width: "100%",
            padding: "0.65rem 1rem",
            border: "1.5px solid #dde2e8",
            borderRadius: "8px",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", minWidth: "700px" }}>
          <thead style={{ backgroundColor: "#1e2a3a", color: "#fff" }}>
            <tr>
              {["الاسم", "رقم البطاقة", "الهاتف", "الجنس", "المديرية", "البرنامج", "تاريخ التسجيل"].map(h => (
                <th key={h} style={{ padding: "0.85rem 1rem", fontWeight: "bold", fontSize: "0.85rem" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: "2rem", textAlign: "center", color: "#6c757d" }}>لا يوجد نتائج</td></tr>
            ) : filtered.map((student, i) => (
              <tr key={student.Student_ID} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{student.Full_Name}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee" }}>{student.ID_Number}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee" }}>{student.Phone_Number}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee" }}>
                  <span style={{ padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.8rem", backgroundColor: student.Gender === "male" ? "#dbeafe" : "#fce7f3", color: student.Gender === "male" ? "#1d4ed8" : "#be185d" }}>
                    {student.Gender === "male" ? "ذكر" : "أنثى"}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee" }}>{student.Directorate}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee" }}>{student.Program_Name}</td>
                <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #eee", fontSize: "0.85rem", color: "#6c757d" }}>
                  {new Date(student.Registration_Date).toLocaleDateString("ar-EG")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: "0.75rem", color: "#6c757d", fontSize: "0.85rem" }}>إجمالي النتائج: {filtered.length} طالب</p>
    </div>
  );
}
