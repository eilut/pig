import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";
import { authenticateAdmin, JWT_SECRET } from "./middleware/auth.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  // Enable CORS for development
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.get("/api/directorates", async (_request, response) => {
    try {
      const [rows] = await pool.query("SELECT Directorate_Name FROM Directorates ORDER BY Directorate_Name ASC");
      response.json({ data: rows.map((r) => r.Directorate_Name) });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/programs", async (request, response) => {
    const directorate = request.query.directorate;
    if (!directorate) {
      return response.status(400).json({ error: "Directorate is required" });
    }

    try {
      const [rows] = await pool.query(
        "SELECT * FROM Programs WHERE Directorate = ? AND Program_Status = 'open'",
        [directorate]
      );
      
      const programs = rows.map(row => ({
        id: row.Program_ID,
        name: row.Program_Name,
        directorate: row.Directorate,
        maleSeatsRemaining: Math.max(0, row.Male_Seats - row.Current_Male_Count),
        femaleSeatsRemaining: Math.max(0, row.Female_Seats - row.Current_Female_Count),
      }));

      response.json({ data: programs });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/register", async (request, response) => {
    const { fullName, idNumber, phoneNumber, birthDate, gender, qualification, directorate, programId } = request.body;
    
    if (!fullName || !idNumber || !phoneNumber || !birthDate || !gender || !qualification || !directorate || !programId) {
      return response.status(400).json({ error: "All fields are required" });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if program exists and is open
      const [programs] = await connection.query(
        "SELECT * FROM Programs WHERE Program_ID = ? FOR UPDATE", 
        [programId]
      );
      
      if (programs.length === 0) {
        throw new Error("program_not_found");
      }
      
      const program = programs[0];
      if (program.Program_Status !== 'open') {
        throw new Error("program_closed");
      }

      // Check seats
      const maleRemaining = program.Male_Seats - program.Current_Male_Count;
      const femaleRemaining = program.Female_Seats - program.Current_Female_Count;
      
      if (gender === 'male' && maleRemaining <= 0) {
        throw new Error("program_full");
      }
      if (gender === 'female' && femaleRemaining <= 0) {
        throw new Error("program_full");
      }

      // Check duplicates
      const [existingStudents] = await connection.query(
        "SELECT * FROM Students WHERE ID_Number = ? OR Phone_Number = ?",
        [idNumber, phoneNumber]
      );
      
      if (existingStudents.length > 0) {
        const student = existingStudents[0];
        if (student.ID_Number === idNumber) throw new Error("duplicate_id");
        if (student.Phone_Number === phoneNumber) throw new Error("duplicate_phone");
      }

      // Insert student
      await connection.query(
        `INSERT INTO Students (Full_Name, ID_Number, Phone_Number, Birth_Date, Gender, Qualification, Directorate, Program_ID) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [fullName, idNumber, phoneNumber, birthDate, gender, qualification, directorate, programId]
      );

      // Update seats
      if (gender === 'male') {
        await connection.query("UPDATE Programs SET Current_Male_Count = Current_Male_Count + 1 WHERE Program_ID = ?", [programId]);
      } else {
        await connection.query("UPDATE Programs SET Current_Female_Count = Current_Female_Count + 1 WHERE Program_ID = ?", [programId]);
      }

      await connection.commit();
      response.status(201).json({ message: "registered_successfully" });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      
      if (["program_not_found", "program_closed", "program_full", "duplicate_id", "duplicate_phone"].includes(error.message)) {
        return response.status(400).json({ error: error.message });
      }
      
      response.status(500).json({ error: "Internal server error" });
    } finally {
      connection.release();
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    try {
      const [admins] = await pool.query("SELECT * FROM Admins WHERE Username = ?", [username]);
      if (admins.length === 0) return res.status(401).json({ error: "Invalid credentials" });

      const admin = admins[0];
      const match = await bcrypt.compare(password, admin.Password_Hash);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: admin.Admin_ID, username: admin.Username, role: admin.Role }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { username: admin.Username, role: admin.Role } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/stats", authenticateAdmin, async (req, res) => {
    try {
      const [[{ totalStudents }]] = await pool.query("SELECT COUNT(*) as totalStudents FROM Students");
      const [[{ openPrograms }]] = await pool.query("SELECT COUNT(*) as openPrograms FROM Programs WHERE Program_Status = 'open'");
      const [[{ todayOperations }]] = await pool.query("SELECT COUNT(*) as todayOperations FROM Students WHERE DATE(Registration_Date) = CURDATE()");
      
      res.json({
        data: {
          totalStudents,
          openPrograms,
          todayOperations
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/students", authenticateAdmin, async (req, res) => {
    try {
      const [students] = await pool.query(`
        SELECT s.*, p.Program_Name 
        FROM Students s 
        JOIN Programs p ON s.Program_ID = p.Program_ID 
        ORDER BY s.Registration_Date DESC
      `);
      res.json({ data: students });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/programs", authenticateAdmin, async (req, res) => {
    try {
      const [programs] = await pool.query("SELECT * FROM Programs ORDER BY Directorate, Program_Name");
      res.json({ data: programs });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/programs/:id", authenticateAdmin, async (req, res) => {
    const { name, directorate, status, maleSeats, femaleSeats } = req.body;
    const programId = req.params.id;

    try {
      let query = "UPDATE Programs SET ";
      const updates = [];
      const values = [];

      if (name) { updates.push("Program_Name = ?"); values.push(name); }
      if (directorate) { updates.push("Directorate = ?"); values.push(directorate); }
      if (status) { updates.push("Program_Status = ?"); values.push(status); }
      if (maleSeats !== undefined) { updates.push("Male_Seats = ?"); values.push(maleSeats); }
      if (femaleSeats !== undefined) { updates.push("Female_Seats = ?"); values.push(femaleSeats); }

      if (updates.length === 0) return res.status(400).json({ error: "No fields to update" });

      query += updates.join(", ") + " WHERE Program_ID = ?";
      values.push(programId);

      await pool.query(query, values);
      res.json({ message: "Program updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/programs", authenticateAdmin, async (req, res) => {
    const { name, directorate, maleSeats = 0, femaleSeats = 0, status = 'open' } = req.body;
    if (!name || !directorate) return res.status(400).json({ error: "Name and Directorate required" });

    try {
      const [result] = await pool.query(
        "INSERT INTO Programs (Program_Name, Directorate, Male_Seats, Female_Seats, Program_Status) VALUES (?, ?, ?, ?, ?)",
        [name, directorate, maleSeats, femaleSeats, status]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/programs/:id", authenticateAdmin, async (req, res) => {
    const programId = req.params.id;
    try {
      const [students] = await pool.query("SELECT 1 FROM Students WHERE Program_ID = ? LIMIT 1", [programId]);
      if (students.length > 0) {
        return res.status(400).json({ error: "لا يمكن حذف البرنامج لوجود طلاب مسجلين فيه" });
      }
      await pool.query("DELETE FROM Programs WHERE Program_ID = ?", [programId]);
      res.json({ message: "Program deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/directorates", authenticateAdmin, async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });

    try {
      const [result] = await pool.query("INSERT INTO Directorates (Directorate_Name) VALUES (?)", [name]);
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "المديرية موجودة مسبقاً" });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/directorates/:name", authenticateAdmin, async (req, res) => {
    const name = req.params.name;
    try {
      const [programs] = await pool.query("SELECT 1 FROM Programs WHERE Directorate = ? LIMIT 1", [name]);
      if (programs.length > 0) return res.status(400).json({ error: "لا يمكن حذف المديرية لوجود برامج مرتبطة بها" });

      await pool.query("DELETE FROM Directorates WHERE Directorate_Name = ?", [name]);
      res.json({ message: "Directorate deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
}
