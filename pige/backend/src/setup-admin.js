import bcrypt from 'bcrypt';
import { pool } from './db.js';

async function setupAdmin() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query("INSERT IGNORE INTO Admins (Username, Password_Hash) VALUES ('admin', ?)", [hash]);
    console.log("Admin seeded.");
  } catch (err) {
    console.error("Failed to seed admin:", err);
  } finally {
    process.exit(0);
  }
}

setupAdmin();
