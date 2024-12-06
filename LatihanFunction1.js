//Perintah untuk Mengimpor Modul readline
const readline = require('readline');

//Perintah untuk Mengimpor Modul validator (library)
const validator = require('validator');

//digunakan untuk mengimport modul fs, modul fs digunakan untuk menulis, membaca, menghapus, modifikasi file di komputer
const fs = require('fs');

//Membuat Interface untuk membaca input dari stdin(inputan user) dan menulis ke stdout(output terminal)
const rl = readline.createInterface
(
    {
        input: process.stdin,
        output: process.stdout
    }
);

const question = (question) => {
    return new Promise((resolve, rejects) => {
    rl.question(question, (input) => {
        resolve(input);
    });
    });
};


const main = async () => {
    const Name = await question("Name : ");
    const Phone = await question("No Handphone : ");
    const Email = await question("Email : ");

const contact = {
    Name,
    Phone,
    Email,
};

let contacts = [];

fs.readFileSync('contact.json', 'utf-8');
contacts.push(contact);
fs.writeFileSync('contact.json', JSON.stringify(contacts,null,2), 'utf8')

rl.close();
};

main();