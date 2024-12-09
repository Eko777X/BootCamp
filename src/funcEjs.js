// const express = require("express"); // Import 'express' module
// const app = express(); // Create an instance of an Express application
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'data', 'contacts.json');
const validator = require ('validator');
// const morgan = require("morgan");
// //const { stream } = require('winston');
// const logStream = fs.createWriteStream(path.join(__dirname,'..', 'data', 'access.log'), { flags: 'a' });


// app.use(morgan('tiny'));

// app.use(morgan('combined', { stream: logStream }));

function readContacts() {
  let contacts = [];
  let errorMessage = null;

  try {
    console.log('Mencoba membaca file...');

    // Mengecek apakah file ada
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      console.log('Data file mentah:', data);  // Menampilkan data mentah yang dibaca dari file

      try {
        contacts = JSON.parse(data);  // Parsing data JSON
        if (!Array.isArray(contacts)) {  // Pastikan data berupa array
          contacts = []; // Jika tidak, set ke array kosong
          errorMessage = 'Data tidak dalam format array';
        }
        console.log('Kontak setelah parsing JSON:', contacts);  // Menampilkan kontak setelah parsing JSON
      } catch (jsonErr) {
        console.error('Error saat parsing JSON:', jsonErr);
        errorMessage = 'Terjadi kesalahan saat parsing data JSON';
      }
    } else {
      console.error('File contacts.json tidak ditemukan');
      errorMessage = 'File contacts.json tidak ditemukan';
    }
  } catch (err) {
    console.error('Error saat membaca file:', err);
    errorMessage = 'Terjadi kesalahan saat membaca data';
  }

  return { contacts, errorMessage };
}
  
  // Fungsi untuk menambahkan kontak baru ke dalam file JSON
  function addContact(name, mobile, email) {
    const { contacts, errorMessage } = readContacts();
    if (errorMessage) {
      console.error(errorMessage);
      return;
    }
  
    // Memastikan bahwa nama, mobile, dan email sudah divalidasi
    if (!name || !mobile || !email) {
      console.error('Nama, mobile, atau email tidak boleh kosong.');
      return;
    }
  
    // Menambahkan kontak baru
    contacts.push({ name, mobile, email });
  
    // Menulis kembali data yang telah diperbarui ke file JSON
    try {
      fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
      console.log('Kontak berhasil ditambahkan!');
    } catch (err) {
      console.error('Error saat menulis ke file:', err);
    }
  }
  
  // Fungsi untuk mengupdate data kontak
  function updateContact(oldName, newName, newMobile, newEmail) {
    const contacts = readContacts();
  
    // Menemukan index kontak yang ingin diperbarui
    const index = contacts.findIndex(contact => contact.name.toLowerCase() === oldName.toLowerCase());
  
    if (index !== -1) {
      // Memperbarui kontak yang ditemukan
      contacts[index] = { name: newName, mobile: newMobile, email: newEmail };
  
      // Menyimpan perubahan ke file
      fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
    }
  }
  
  // Fungsi untuk menghapus kontak berdasarkan nama
  function deleteContact(name) {
    let { contacts, errorMessage } = readContacts();
    if (errorMessage) {
      console.error(errorMessage);
      return;
    }
  
    // Menghapus kontak yang cocok dengan nama
    const originalLength = contacts.length;
    contacts = contacts.filter(contact => contact.name.toLowerCase() !== name.toLowerCase());
  
    if (contacts.length === originalLength) {
      console.error('Kontak tidak ditemukan!');
      return;
    }
  
    // Menyimpan kembali data yang telah diperbarui ke file
    try {
      fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
      console.log('Kontak berhasil dihapus!');
    } catch (err) {
      console.error('Error saat menulis ke file:', err);
    }
  }
  
  
  //fungsi validasi no HP
function validateMobile(mobile) {
  // Validasi nomor telepon menggunakan validator
  if (!validator.isMobilePhone(mobile, 'id-ID')) {
    console.error('Nomor telepon tidak valid!');
    return false;
  }
  return true;
}

// fungsi validasi nama
function validateName(name, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error saat membaca file contacts.json:', err);
      return callback(err); // Jika terjadi error saat membaca file
    }

    try {
      const users = JSON.parse(data); // Parsing JSON
      if (!Array.isArray(users)) {
        return callback(new Error('Data dalam file bukan array'));
      }

      // Cek apakah nama sudah ada dalam data pengguna
      const userExists = users.some(user => user.name.toLowerCase() === name.toLowerCase());
      callback(null, !userExists); // Mengembalikan true jika nama tersedia, false jika sudah ada
    } catch (parseError) {
      console.error('Error saat parsing JSON:', parseError);
      callback(parseError); // Jika terjadi error saat parsing JSON
    }
  });
}

 // fungsi validasi email 
function validateEmail(email) {
  const { contacts, errorMessage } = readContacts();
  if (errorMessage) {
    console.error(errorMessage);
    return { isValid: false };
  }

  const existingContact = contacts.find(contact => contact.email === email); // Mencari email yang sama
  if (existingContact) {
    return { isValid: false }; // Jika email ditemukan
  }
  return { isValid: true }; // Jika email tidak ditemukan
}

// fungsi menampilkan page
function renderContactPage(res, title = "", errorMessage = null, successMessage = null) {
  const { contacts, errorMessage: readErrorMessage } = readContacts();  // Memanggil fungsi readContacts
  if (readErrorMessage) {
    console.error(readErrorMessage);
    return res.render('contact', { 
      data: [],  // Mengirimkan array kosong jika ada error
      title: title,  
      errorMessage: 'Terjadi kesalahan membaca data kontak',  // Pesan error generik
      successMessage: null
    });
  }
  res.render('contact', { 
    data: contacts,  
    title: title,  
    errorMessage: errorMessage,  
    successMessage: successMessage  
  });
}


module.exports = { readContacts, addContact, updateContact, deleteContact, validateMobile, validateName, validateEmail, renderContactPage };