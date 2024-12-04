const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'data', 'contacts.json');

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
    const phoneRegex = /^[0-9]{10,15}$/; // Regex untuk validasi nomor telepon (angka, 10-15 digit)
    return phoneRegex.test(mobile);  // Return true jika valid, false jika tidak
  }
  
  
  module.exports = { readContacts, addContact, updateContact, deleteContact, validateMobile };