const express = require("express");
const app = express();
const { Pool } = require('pg');
const port = 3000;

// Konfigurasi koneksi ke PostgreSQL
const pool = new Pool({
  user: 'postgres',        // Ganti dengan username PostgreSQL Anda
  host: 'localhost',        // Ganti jika PostgreSQL berada di server lain
  database: 'db_contacts', // Ganti dengan nama database yang Anda inginkan
  password: '123', // Ganti dengan password PostgreSQL Anda
  port: 5432,               // Biasanya port PostgreSQL adalah 5432
});

app.use(express.json());

// // Fungsi untuk mengambil versi PostgreSQL
// const getPostgresVersion = async () => {
//   try {
//     const result = await pool.query('SELECT version();');
//     console.log('PostgreSQL version:', result.rows[0].version);
//   } catch (error) {
//     console.error('Error fetching PostgreSQL version:', error);
//   } finally {
//     pool.end();
//   }
// };

// getPostgresVersion();

// Fungsi untuk memasukkan data ke tabel `data_contacts`
const insertData = async () => {
    try {
     const name = "Eko";
     const mobile = "082313131";
     const email = "eko@gmail.com";
     const newCont = await pool.query(
        "INSERT INTO data_contacts (Name, Mobile, Email) VALUES ($1, $2, $3) RETURNING*",[name, mobile, email]
    );
      console.log(newCont);
    } catch(err){
        console.error(err.message);
    }
  };
  
  // Menjalankan fungsi insertData
  insertData();

  app.listen(port,() => {
    console.log(`Server on ${port}`);
  });