const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'data', 'contacts.json');
const validator = require ('validator');

// Fungsi untuk membaca kontak dari file JSON
function readContacts() {
    let contacts = [];
    if (fs.existsSync(filePath)) {
      contacts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return contacts;
  }
  
  // Fungsi untuk menambahkan kontak baru ke dalam file JSON
  function addContact(name, mobile, email) {
    
    const contacts = readContacts();
  
    // Menambahkan kontak baru
    contacts.push({ name, mobile, email });
  
    // Menulis kembali data yang telah diperbarui ke file JSON
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
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
    let contacts = readContacts();
  
    // Menghapus kontak yang cocok dengan nama
    contacts = contacts.filter(contact => contact.name.toLowerCase() !== name.toLowerCase());
  
    // Menyimpan kembali data yang telah diperbarui ke file
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
  }
  
  // Fungsi untuk memvalidasi nomor telepon
  function validateMobile(mobile) {
    return validator.isMobilePhone(mobile,'id-ID')
  }
  

  // Fungsi untuk memeriksa apakah nama sudah ada
function validateName(name, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return callback(err); // Jika terjadi error saat membaca file
    }
    try {
      const users = JSON.parse(data); // Parsing JSON
      // Cek apakah nama sudah ada dalam data pengguna
      const userExists = users.some(user => user.name.toLowerCase() === name.toLowerCase());
      callback(null, !userExists); // Mengembalikan true jika nama tersedia, false jika sudah ada
    } catch (parseError) {
      callback(parseError); // Jika terjadi error saat parsing JSON
    }
  });
}
  
// Fungsi untuk merender halaman kontak
function renderContactPage(res, title = "", errorMessage = null, successMessage = null) {
  const contacts = readContacts();  // Memanggil fungsi readContacts dari funcEjs.js
  res.render('contact', { 
    data: contacts,  // Menyertakan data kontak ke dalam view
    title: title,  // Menyertakan judul
    errorMessage: errorMessage,  // Menyertakan pesan error
    successMessage: successMessage  // Menyertakan pesan sukses
  });
} 


// Fungsi untuk validasi apakah email sudah terdaftar
function validateEmail(email) {
  const contacts = readContacts(); // Membaca data kontak dari file
  const existingContact = contacts.find(contact => contact.email === email); // Mencari email yang sama

  if (existingContact) {
    return { isValid: false}; // Jika email ditemukan
  }
  return { isValid: true}; // Jika email tidak ditemukan
}



module.exports = { readContacts, addContact, updateContact, deleteContact, validateMobile, validateName, validateEmail, renderContactPage };