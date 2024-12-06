const readline = require('readline');
const validator = require('validator');
const fs = require('fs');


const rl = readline.createInterface
(
    {
        input: process.stdin,
        output: process.stdout
    }
);


rl.question('Siapa nama anda?', nama => 
    {
    console.log(`Halo, ${nama}!`);
    rl.question('Nomor Handphone?', noHp => 
        {
        console.log(`No Handhphone, ${noHp}!`);
        if (validator.isMobilePhone(noHp, 'id-ID'))
            {
                console.log(`No Handphone: , ${noHp},! Valid :`); 
            }
            else {console.log(`No Handphone: , ${noHp},! InValid :`);}
        rl.question('Alamat Email?', Email => 
            {
            if (validator.isEmail(Email))
                {
                    console.log(`Email: , ${Email},! Valid :`);
                }
                else {
                    console.log(`Email: , ${Email},! InValid :`);
                    }

                    
const newContact = { nama, noHp, Email };
var contacts = [];

const fileContent = fs.readFileSync('contact.json', 'utf-8'); // Baca isi file
        contacts = JSON.parse(fileContent); // Ubah string JSON menjadi array

      // Menambahkan kontak baru ke daftar kontak yang sudah ada
      contacts.push(newContact);

      // Menyimpan daftar kontak yang telah diperbarui kembali ke file contacts.json
      fs.writeFileSync('contact.json', JSON.stringify(contacts, null, 2), 'utf-8');
      console.log('Kontak berhasil disimpan!'); // Tampilkan pesan sukses

        rl.close();
            })
     })
});