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
rl.question('Siapa nama anda?', nama => {
    console.log(`Halo, ${nama}!`);
    rl.question('Nomor Handphone?', noHp => {
        console.log(`Halo, ${noHp}!`);
        rl.question('Alamat Email?', Email => {
            console.log(`Halo, ${Email}!`);

        rl.close();
        })
    })
});