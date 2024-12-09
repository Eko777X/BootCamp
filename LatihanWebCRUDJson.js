const express = require("express"); // Import 'express' module
//const expressLayouts = require('express-ejs-layouts');
const app = express(); // Create an instance of an Express application
const port = 3000; // Define the port to be used by the server
const path = require("path");
const fs = require ("fs");
//const { title } = require("process");
const filePath = path.join(__dirname, 'data', 'contacts.json')
const bodyParser = require('body-parser');
const morgan = require("morgan"); // Mengimpor Morgan
//const winston = require('winston'); // Untuk membuat pencatatan aksi lebih detail
// Buat stream untuk log ke file
const logStream = fs.createWriteStream(path.join(__dirname, 'data', 'access.log'), { flags: 'a' });
const { readContacts, addContact, updateContact, deleteContact,  validateMobile, validateName, validateEmail, renderContactPage} = require('./src/funcEjs');  // Mengimpor fungsi dari funcEjs.js

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
  const { contacts, errorMessage } = readContacts(req,res);

    if (errorMessage) {
      console.error(errorMessage);
      // Jika ada pesan error, render halaman kontak dengan pesan error
      return res.render('contact', {
        data: contacts,
        title: 'Contact Page',
        errorMessage: errorMessage,
        successMessage: null,      
      });
    }
    // Render halaman kontak jika tidak ada error
    renderContactPage(res, 'Contact Page', null, null);
    
  });


// Route untuk menambahkan kontak (POST ke /contact)
app.post('/contact', (req, res) => {
  const { name, mobile, email } = req.body;  // Mengambil data dari form

  // if (!name) {
  //   return res.status(400).json({ message: 'Nama harus diisi' });
  // }
  // Memanggil fungsi validasi untuk mengecek ketersediaan nama
  validateName(name, (isAvailable) => {
  if (isAvailable) {
      // Panggil fungsi validasi mobile
    if (!validateMobile(mobile)) {
    renderContactPage(res, 'Contact Page', 'Invalid Mobile Number', null);
    } else {
       // Panggil fungsi Validasi email
      const validationResult = validateEmail(email);
      if (!validationResult.isValid) {
      // Jika email sudah terdaftar, kirimkan pesan error
      renderContactPage(res, 'Contact Page', 'Email Its Already Uses', null);
      } else {
        // Memanggil fungsi addContact untuk menambahkan data
        addContact(name, mobile, email);
        res.redirect('/contact');
      }   
    // Jika nomor telepon valid, kirimkan pesan sukses ke EJS   
    // res.render('contact', {
    //   data: contacts,
    //   title: "Contact",
    //   successMessage: 'Kontak berhasil ditambahkan!',
    //   errorMessage: null
    // });
    }
  } else {
      renderContactPage(res, 'Contact Page', 'Nama sudah ada', null);
  }
  });
});

// Route untuk halaman edit kontak (/Edit/:name)
app.get('/Edit/:name', (req, res) => {
  const name = req.params.name;
  const contacts = readContacts();
  const contactToEdit = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
  res.render('Edit', {  
    contactToEdit, 
    title: "Edit Contact",
    errorMessage: null,   // Set nilai default null
    successMessage: null });
});

// Route untuk update kontak (POST ke /Edited/:name)
app.post('/Edited/:name', (req, res) => {
  const oldName = req.params.name;
  const { name, mobile, email } = req.body;

  // Panggil fungsi validasi
  if (!validateMobile(mobile)) {
    const name = req.params.name;
    const contacts = readContacts();
    const contactToEdit = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
    // Jika nomor telepon tidak valid, kirimkan pesan error ke EJS
    res.render('Edit', {
      contactToEdit,
      title: "Edit Contact",
      errorMessage: 'Invalid Mobile Number !',
      successMessage: null
    });
  } else {
    updateContact(oldName, name, mobile, email);
    res.redirect('/contact');
  }
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
app.listen(port, () => {
  console.log('Server berjalan di http://localhost:3000');
});