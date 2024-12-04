const readline = require('node:readline'); // Modul bawaan Node.js untuk input/output terminal
const validator = require('validator');   // Modul pihak ketiga untuk validasi data
const fs = require('fs');                 // Modul bawaan Node.js untuk bekerja dengan sistem file
const filePath = ('data/contacts.json');


// Membuat antarmuka readline untuk membaca input dan menulis output
const rl = readline.createInterface({
    input: process.stdin,    // Standar input, yaitu terminal
    output: process.stdout,  // Standar output, yaitu terminal
});

// Fungsi utilitas untuk meminta input dari pengguna
const question = (prompt) => {
    return new Promise(resolve => rl.question(prompt, resolve));
};

    //  function DeleteContact (argv){

    //     let contact = [];
    //     if (fs.existsSync(filePath)) {
    //         contacts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    //       }

    //  //const contacts = JSON.parse(fs.readFileSync("data/contacts.json" , "utf-8"));
    //     const filteredContacts = contacts.filter (
    //      (contact) => contact.name !== argv.name);
        
    //     if (contact.length === filteredContacts.length) {
    //          console.log(`Data dengan nama :"${argv.name}" Tidak Ditemukan`);
    //      } else {
    
    //        saveContact(filteredContacts);
    //        console.log(`Data dengan nama : "${argv.name}"Telah Di Delete. `);
    //      } 

    //  fs.writeFileSync("data/contacts.json", JSON.stringify(filteredContacts, null, 2), 'utf-8');
 //}


function loadContacts() {
    let contacts = [];
      if (fs.existsSync(filePath)) {
        contacts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
  
      if (contacts.length === 0) {
        console.log("Tidak ada kontak yang ditemukan.");
      } else {
        console.log("Daftar Kontak:");
        contacts.forEach((contact, index) => {
          console.log(`${index + 1}. ${contact.name}`);
        });
      }
}


 function DeleteContact(argv) {
    // Membaca data kontak dari file JSON, jika file tidak ada, inisialisasi array kosong
    let contacts = [];
    if (fs.existsSync(filePath)) {
      contacts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } else {
      console.log('File kontak tidak ditemukan!');
      return;
    }
  
    // Menyaring kontak yang tidak sesuai dengan nama yang diberikan
    const filteredContacts = contacts.filter(contact => contact.name !== argv.name);
    console.log(filteredContacts);
    // Jika filteredContacts memiliki jumlah yang sama dengan contacts, berarti nama tidak ditemukan
    if (contacts.length === filteredContacts.length) {
      console.log(`Kontak dengan nama "${argv.name}" tidak ditemukan.`);
    } else {
      // Menulis kembali data yang telah difilter ke dalam file JSON
      fs.writeFileSync(filePath, JSON.stringify(filteredContacts, null, 2), 'utf-8');
      console.log(`Kontak dengan nama "${argv.name}" telah dihapus.`);
    }
  }
  



// Fungsi untuk menambahkan kontak baru ke file JSON
    const saveContact = (contact) => {
    
    // Membaca data dari file JSON atau menginisialisasi array kosong jika file tidak ada
    const contacts = fs.existsSync(filePath) ? 
        JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];

    contacts.push(contact); // Menambahkan kontak baru ke dalam array
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), 'utf-8'); // Menulis kembali data ke file
};



function Update () {

}



// Mengekspor fungsi agar bisa digunakan di file lain
module.exports = { question, saveContact, rl, validator , DeleteContact, loadContacts};



