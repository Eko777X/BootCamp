const express = require('express');
const path = require('path');
const app = express();
const pool = require("./src/conn/db_contacts");
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk menampilkan data
app.get('/', async (req, res) => {
  try {
    // Query untuk mengambil data dari tabel
    const result = await pool.query(`SELECT * FROM public.data_contacts ORDER BY id ASC`);
    const data = result.rows;
    // Render data ke file EJS
    res.render('index', { title: 'Home', data});
  } catch (err) {
    console.error('Error mengambil data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
