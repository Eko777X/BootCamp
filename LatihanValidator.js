//Perintah untuk Mengimpor Modul readline
const readline = require('readline');

//Perintah untuk Mengimpor Modul validator (library)
const validator = require('validator');

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

        rl.close();
            })
        })
    });