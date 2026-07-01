// Alternative database configuration for PostgreSQL (for Render/Railway)
// Use this file instead of db.js when deploying to services that offer PostgreSQL

import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper function to maintain compatibility with MySQL interface
export const query = async (sql, params) => {
  // Convert MySQL syntax to PostgreSQL if needed
  let pgSql = sql;
  
  // Simple conversion examples (may need more complex conversions)
  pgSql = pgSql.replace(/`/g, '"'); // MySQL backticks to PostgreSQL double quotes
  
  const result = await pool.query(pgSql, params);
  
  // Return in format compatible with MySQL
  return {
    results: result.rows,
    insertId: result.rows[0]?.id,
    affectedRows: result.rowCount
  };
};
