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

           
           if(!fs.existsSync("./contact.json")){
                console.log("File Tidak Ada")
                 fs.writeFileSync('./contact.json',"[]",'utf8') //=> {
                //     if (err) {
                //         console.error('Error Menulis Ke File', err);
                //     } else {
                //         console.log('Data Berhasil Disimpan');
                //     }
                // })
            } 
            // let NewArray = [];
            // Baca isi file data secara Asinkron
            let ArrayContact = fs.readFileSync('contact.json', 'utf-8')
            console.log(ArrayContact) 
            // Cek apakah data kosong atau file belum memiliki data
                // let arrayData;
                // if (data === '') {
                //     arrayData = []; // Jika file kosong, inisialisasi array kosong
                // } else {
                // arrayData =JSON.parse(data); // Ubah string JSON menjadi objek (array)
                // console.log(arrayData) // Menampilkan Isi File
                // }
            //});
            console.log (ArrayContact)
            let NewArray =JSON.parse(ArrayContact);
            console.log(1)
            const ObjectDataContact = {Name, Phone, Email}; // Memasukkan data ke dalam objek ini
            NewArray.push(ObjectDataContact);
            // Ubah kembali array ke format JSON
            // const updatedDataContact = JSON.stringify(ObjectDataContact, null, 2); // null dan 2 untuk identitasi yang rapi
           
            // Menulis data yang telah diperbaharui kembali ke file secara Asinkron
            fs.writeFile('contact.json', JSON.stringify(NewArray,null,2), 'utf8', (err) => {
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