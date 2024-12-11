const Pool = require('pg').Pool;

// Konfigurasi koneksi ke PostgreSQL
const pool = new Pool({
  user: 'postgres',        // Ganti dengan username PostgreSQL Anda
  host: 'localhost',        // Ganti jika PostgreSQL berada di server lain
  database: 'db_contacts', // Ganti dengan nama database yang Anda inginkan
  password: '123', // Ganti dengan password PostgreSQL Anda
  port: 5432,               // Biasanya port PostgreSQL adalah 5432
});

module.exports = pool;