//Perintah untuk Mengimpor Modul readline
const readline = require('readline');

//Perintah untuk Mengimpor Modul validator (library)
const validator = require('validator');

//digunakan untuk mengimport modul fs, modul fs digunakan untuk menulis, membaca, menghapus, modifikasi file di komputer
const fs = require('fs');
const { isUtf8 } = require('buffer');

//Membuat Interface untuk membaca input dari stdin(inputan user) dan menulis ke stdout(output terminal)
const rl = readline.createInterface
(
    {
        input: process.stdin,
        output: process.stdout
    }
);

//Menanyakan sesuatu dan membaca input baris per baris
rl.question('Siapa nama anda?  ', Name => 
    {
    rl.question('Nomor Handphone?  ', Phone => 
        {
        rl.question('Alamat Email?  ', Email => 
            {
            //validator Phone dan Email
            const PhoneValid = validator.isMobilePhone(Phone, "id-ID");
            const EmailValid = validator.isEmail(Email)     
            
            console.log('');
            console.log(`Name           : ${Name}`);
            console.log(`No Handhphone  : ${Phone} (${PhoneValid ? "Valid" : "Invalid"})`);
            console.log(`Email          : ${Email} (${EmailValid ? "Valid" : "Invalid"})`);

           
           
           
            // Baca isi file data secara Asinkron
            fs.readFile('contact.json', 'utf-8', (err,data)=> {
                if (err) {
                    console.error('Error Membaca File', err);
                    return;
                }
                let arrayData;
                if (data === '') {
                    arrayData = [];
                } else {
                arrayData =JSON.parse(data); // Ubah string JSON menjadi objek (array)
                console.log(arrayData) // Menampilkan Isi File
                }
            });
            
            arrayData = [Name, Phone, Email];
            //const newData = {Name, Phone, Email};
            //arrayData.push(newData);

            // Ubah kembali array ke format JSON
            const updatedData = JSON.stringify(arrayData, null, 2); // null dan 2 untuk identitasi yang rapi
           
           
            fs.writeFile('contact.json', updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Error Menulis Ke File', err);
                } else {
                    console.log('Data Berhasil Disimpan');
                }
            })
           
           
        rl.close();
            })
        })
    });