const express = require("express"); // Import 'express' module
//const expressLayouts = require('express-ejs-layouts');
const app = express(); // Create an instance of an Express application
const port = 3000; // Define the port to be used by the server
const path = require("path");
const fs = require ("fs");
const { title } = require("process");
const filePath = path.join(__dirname, 'data', 'contacts.json')
const bodyParser = require('body-parser');
const morgan = require("morgan"); // Mengimpor Morgan
const winston = require('winston');
// Buat stream untuk log ke file
const logStream = fs.createWriteStream(path.join(__dirname, 'data', 'access.log'), { flags: 'a' });
const { readContacts, addContact, updateContact, deleteContact,  validateMobile } = require('./src/funcEjs');  // Mengimpor fungsi dari funcEjs.js

// Mengatur view engine ke EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');

// Menggunakan folder public untuk file statis (CSS, gambar, dll.)
app.use(express.static("public"));

// Middleware untuk parse body data
app.use(bodyParser.urlencoded({ extended: true }));

// Menggunakan Morgan untuk mencatat log setiap permintaan HTTP
// Gunakan Morgan dengan stream untuk mencatat log ke file
app.use(morgan('combined', { stream: logStream }));
// 'tiny' adalah format log yang singkat
// 'combined': Format yang lebih lengkap.
// 'dev': Format warna-warni yang lebih informatif.
// 'common': Format standar yang lebih rinci.

app.use((req,res,next) => {
  console.log("Time", Date.now());
  next();
});


app.get('/', (req, res) => {
  res.render('index',{
    title: "Home Page"}
    //content: 'Selamat datang di halaman utama!'
  );
});

app.get('/about', (req, res) => {
  res.render('about',{
    title: "About"}
  );
});

// Route untuk halaman kontak (/contact)
app.get('/contact', (req, res) => {
  const contacts = readContacts();  // Memanggil fungsi readContacts dari funcEjs.js
  res.render('contact', { 
    data: contacts, 
    title: "Contact",
    errorMessage: null,   // Set nilai default null
    successMessage: null  // Set nilai default null
  });
});


// Route untuk menambahkan kontak (POST ke /contact)
app.post('/contact', (req, res) => {
  const { name, mobile, email } = req.body;  // Mengambil data dari form

  // Panggil fungsi validasi
  if (!validateMobile(mobile)) {
    const contacts = readContacts();
    // Jika nomor telepon tidak valid, kirimkan pesan error ke EJS
    res.render('contact', {
      data: contacts,
      title: "Contact",
      errorMessage: 'Nomor telepon tidak valid. Harap masukkan 10-15 digit angka.',
      successMessage: null
    });
  } else {
    const contacts = readContacts();
    // Memanggil fungsi addContact untuk menambahkan data
    addContact(name, mobile, email);
    // Jika nomor telepon valid, kirimkan pesan sukses ke EJS
    res.render('contact', {
      data: contacts,
      title: "Contact",
      successMessage: 'Kontak berhasil ditambahkan!',
      errorMessage: null
    });
  }
});

// Route untuk halaman edit kontak (/Edit/:name)
app.get('/Edit/:name', (req, res) => {
  const name = req.params.name;
  const contacts = readContacts();
  const contactToEdit = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
  res.render('Edit', {  contactToEdit, title: "Edit Contact" });
});

// Route untuk update kontak (POST ke /Edited/:name)
app.post('/Edited/:name', (req, res) => {
  const oldName = req.params.name;
  const { name, mobile, email } = req.body;
  updateContact(oldName, name, mobile, email);  // Memanggil fungsi updateContact dari funcEjs.js
  res.redirect('/contact');  // Redirect ke halaman kontak setelah data diperbarui
});

// Route untuk menghapus kontak (/delete/:name)
app.post('/delete/:name', (req, res) => {
  const name = req.params.name;  // Nama kontak yang ingin dihapus
  deleteContact(name);  // Memanggil fungsi deleteContact dari funcEjs.js
  res.redirect('/contact');  // Redirect kembali ke halaman kontak setelah data dihapus
});

// Define a middleware to handle 404 errors (page not found)
app.use((req, res) => {
    res.status(404).send("404 : Page not found Broo!"); // Send a 404 response when no route matches the request
  });

// Menjalankan server
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});