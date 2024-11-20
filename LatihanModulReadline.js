//Perintah untuk Mengimpor Modul readline
const readline = require('readline');

//Membuat Interface untuk membaca input dari stdin(inputan user) dan menulis ke stdout(output terminal)
const rl = readline.createInterface
(
    {
        input: process.stdin,
        output: process.stdout
    }
);

//Menanyakan sesuatu dan membaca input baris per baris
rl.question('Siapa nama anda?', nama => 
    {
    rl.question('Nomor Handphone?', noHp => 
        {
        rl.question('Alamat Email?', Email => 
            {
            console.log('');
            console.log(`Name           : ${nama}`);
            console.log(`No Handhphone  : ${noHp}`);
            console.log(`Email          : ${Email}`);

        rl.close();
            })
        })
    });