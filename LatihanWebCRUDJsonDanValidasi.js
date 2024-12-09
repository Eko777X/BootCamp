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


// Menggunakan Morgan untuk mencatat log setiap permintaan HTTP
// Gunakan Morgan dengan stream untuk mencatat log ke file
app.use(morgan('combined', { stream: logStream }));
// 'tiny' adalah format log yang singkat
// 'combined': Format yang lebih lengkap.
// 'dev': Format warna-warni yang lebih informatif.
// 'common': Format standar yang lebih rinci.
app.use(morgan("dev")); // Log ke konsol


// Mengatur view engine ke EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');

// Menggunakan folder public untuk file statis (CSS, gambar, dll.)
app.use(express.static("public"));

// Middleware untuk parse body data
app.use(bodyParser.urlencoded({ extended: true }));


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

app.get('/contact', (req, res) => {
  const { contacts, errorMessage } = readContacts(); // Ambil hasil dari readContacts

  // Jika ada errorMessage, tampilkan halaman error
  if (errorMessage) {
    console.error(errorMessage); // Log pesan error

    if (typeof errorMessage === 'string' && errorMessage.includes('Terjadi kesalahan saat parsing data JSON')) {
      // Jika terjadi error pada file, set status 500
      res.status(500);
    }

    // Render halaman dengan errorMessage
    return res.render('contact', {
      data: [], // Kirim array kosong jika error
      title: 'Contact Page',
      errorMessage: errorMessage, // Kirim pesan error ke view
      successMessage: null, // Tidak ada pesan sukses
    });
  }
  // Jika tidak ada error, render halaman dengan data kontak
  return renderContactPage(res, 'Contact Page', null, null);
});

app.post('/contact', (req, res) => {
  const { name, mobile, email } = req.body;

  // Validasi nama
  validateName(name, (err, isAvailable) => {
    if (err) {
      console.error('Error saat memvalidasi nama:', err);
      return res.status(500).send('Terjadi kesalahan saat memvalidasi nama');
    }

    if (!isAvailable) {
      // Jika nama sudah ada
      return renderContactPage(res, 'Contact Page', 'Nama sudah ada', null);
    }

    // Validasi nomor telepon
    if (!validateMobile(mobile)) {
      return renderContactPage(res, 'Contact Page', 'Nomor telepon tidak valid', null);
    }

    // Validasi email
    const validationResult = validateEmail(email);
    if (!validationResult.isValid) {
      return renderContactPage(res, 'Contact Page', 'Email sudah terdaftar', null);
    }

    // Jika semua validasi lolos, tambah kontak baru
    addContact(name, mobile, email);
    res.redirect('/contact'); // Redirect ke halaman kontak setelah berhasil menambahkan
  });
});



// Route untuk halaman edit kontak (/Edit/:name)
app.get('/Edit/:name', (req, res) => {
  const name = req.params.name;
  const { contacts, errorMessage } = readContacts();
  if (errorMessage) {
    return res.render('Edit', {  
      contactToEdit: null, 
      title: "Edit Contact",
      errorMessage: errorMessage,  // Pesan error jika terjadi kesalahan membaca file
      successMessage: null
    });
  }
  const contactToEdit = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
  res.render('Edit', {  
    contactToEdit, 
    title: "Edit Contact",
    errorMessage: null,   // Set nilai default null
    successMessage: null });
});

app.post('/Edited/:name', (req, res) => {
  const oldName = req.params.name;
  const { name, mobile, email } = req.body;

  // Validasi data input (nama, mobile, dan email)
  if (!name || !mobile || !email) {
    return res.render('Edit', {
      contactToEdit: { name: oldName, mobile, email },
      title: "Edit Contact",
      errorMessage: 'Semua field harus diisi!',
      successMessage: null
    });
  }

  // Validasi nomor telepon
  if (!validateMobile(mobile)) {
    const { contacts, errorMessage } = readContacts();
    const contactToEdit = contacts.find(c => c.name.toLowerCase() === oldName.toLowerCase());
    return res.render('Edit', {
      contactToEdit,
      title: "Edit Contact",
      errorMessage: 'Nomor telepon tidak valid!',
      successMessage: null
    });
  }

  // Cek apakah nama baru sudah ada
  const { contacts } = readContacts();
  const nameExists = contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase());

  if (nameExists && name.toLowerCase() !== oldName.toLowerCase()) {
    return res.render('Edit', {
      contactToEdit: { name: oldName, mobile, email },
      title: "Edit Contact",
      errorMessage: 'Nama sudah terdaftar, pilih nama lain!',
      successMessage: null
    });
  }

  // Jika nama tidak berubah, hanya update mobile dan email
  const index = contacts.findIndex(c => c.name.toLowerCase() === oldName.toLowerCase());

  if (index !== -1) {
    // Update kontak di index yang ditemukan
    contacts[index].mobile = mobile;
    contacts[index].email = email;
    
    // Jika nama juga berubah, update nama
    if (name !== oldName) {
      contacts[index].name = name;
    }

    // Simpan perubahan ke file
    try {
      fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
      // Redirect ke halaman kontak setelah berhasil update
      return res.redirect('/contact');
    } catch (err) {
      console.error('Error saat menyimpan perubahan:', err);
      return res.render('Edit', {
        contactToEdit: { name: oldName, mobile, email },
        title: "Edit Contact",
        errorMessage: 'Terjadi kesalahan saat menyimpan data.',
        successMessage: null
      });
    }
  } else {
    return res.render('Edit', {
      contactToEdit: { name: oldName, mobile, email },
      title: "Edit Contact",
      errorMessage: 'Kontak tidak ditemukan.',
      successMessage: null
    });
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