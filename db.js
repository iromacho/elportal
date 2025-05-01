const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;

const createTableQuery = `
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  contraseña VARCHAR(100) NOT NULL
);
`;

pool.query(createTableQuery)
  .then(() => console.log("Tabla de usuarios creada o ya existente"))
  .catch(err => console.error("Error al crear la tabla:", err));

