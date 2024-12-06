const express = require("express");
const path = require("path");
const { readContacts } = require('./src/funcEjs');  // Mengimpor fungsi readContacts dari funcEjs.js
const app = express();
const port = 3000;

// Mengatur view engine ke EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Menggunakan folder 'views' untuk EJS

// Middleware untuk parse body data
app.use(express.urlencoded({ extended: true }));

// Route untuk halaman utama (/)
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Home Page!</h1>'); // Menampilkan halaman utama
});

// Route untuk halaman kontak (/contact)
app.get('/contact', (req, res) => {
  const contacts = readContacts();  // Memanggil fungsi readContacts dari funcEjs.js
  res.render('contact', { data: contacts, title: "Contact" });  // Mengirim data ke tampilan EJS
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
