const express = require('express');
const path = require('path');
const app = express();
const pool = require("./src/conn/db_contacts");
const PORT = 3000;
const {deleteContact, addContact, readContacts} = require('./src/func');  // Mengimpor fungsi dari funcEjs.js


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk menangani penghapusan data
app.use(express.urlencoded({ extended: true }));


// Route untuk menampilkan data
app.get('/', async (req, res) => {
  try {
    const data = await readContacts();// tampilkan isi data dari table data_contacts
    // Render data ke file EJS
    res.render('index', { title: 'Home', data, success: 'false'});
  } catch (err) {
    console.error('Error mengambil data:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/create', (req, res) => {
  res.render('create',{
    title: "Add Data", success: "false"}
  );
});

app.post('/created', async (req, res) => {
  const { name, mobile, email } = req.body;
  try {
    const isAdded = await addContact(name, mobile, email);
    if (isAdded) {
      const data = await readContacts();// tampilkan isi data dari table data_contacts
      console.log(`Contact Added: ${name}`);
      res.render('index', { title: 'Home', data, success: 'true' });//Render ke halaman utama setelah berhasil menambahkan
    } else {
      res.status(400).send('Failed to add contact');
    }
  } catch (err) {
    console.error('Error adding contact:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const isDeleted = await deleteContact(id);
    if (isDeleted) {
      const data = await readContacts();// tampilkan isi data dari table data_contacts
      console.log(`Contact With Id: ${id} Was Deleted`);
      res.render('index', { title: 'Home', data, success: 'true' });
    } else {
      console.log(`No contact found with ID ${id}`);
      res.redirect('/');
    }
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
