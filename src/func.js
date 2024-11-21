const readline = require('node:readline'); // Modul bawaan Node.js untuk input/output terminal
const validator = require('validator');   // Modul pihak ketiga untuk validasi data
const fs = require('fs');                 // Modul bawaan Node.js untuk bekerja dengan sistem file

// Membuat antarmuka readline untuk membaca input dan menulis output
const rl = readline.createInterface({
    input: process.stdin,    // Standar input, yaitu terminal
    output: process.stdout,  // Standar output, yaitu terminal
});

// Fungsi utilitas untuk meminta input dari pengguna
const question = (prompt) => {
    return new Promise(resolve => rl.question(prompt, resolve));
};

// Fungsi untuk menambahkan kontak baru ke file JSON
const saveContact = (contact) => {
    const filePath = 'data/contacts.json'; // Lokasi file kontak
    
    // Membaca data dari file JSON atau menginisialisasi array kosong jika file tidak ada
    const contacts = fs.existsSync(filePath) ? 
        JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];

    contacts.push(contact); // Menambahkan kontak baru ke dalam array
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), 'utf-8'); // Menulis kembali data ke file
};

// Mengekspor fungsi agar bisa digunakan di file lain
module.exports = { question, saveContact, rl, validator };