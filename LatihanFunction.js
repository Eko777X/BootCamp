const { question, saveContact, rl, validator } = require("./src/func"); // Impor fungsi dan modul dari func.js

// Fungsi utama untuk menjalankan aplikasi
const main = async () => {
    // Meminta input nama
    const name = await questionInput("Nama: ", input => !!input.trim(), "Nama tidak boleh kosong.");

    // Meminta input nomor telepon dengan validasi menggunakan do-while
    let phone;
    do {
        phone = await question("Nomor Telepon: ");
        if (!validator.isMobilePhone(phone, 'id-ID')) {
            console.log("Nomor telepon tidak valid. Harap gunakan format Indonesia (id-ID).");
        }
    } while (!validator.isMobilePhone(phone, 'id-ID'));

    // Meminta input email dengan validasi menggunakan do-while
    let mail;
    do {
        mail = await question("Email: ");
        if (!validator.isEmail(mail)) {
            console.log("Email tidak valid. Harap masukkan email yang benar.");
        }
    } while (!validator.isEmail(mail));

    // Menyimpan data kontak ke file
    saveContact({ name, phone, mail });

    // Menutup antarmuka readline
    rl.close();
};

// Fungsi utilitas untuk meminta input dengan validasi (khusus untuk fungsi yang tidak menggunakan tanpa do-while)
const questionInput = async (prompt, validate, errorMessage) => {
    let input;
    do {
        input = await question(prompt);
        if (!validate(input)) console.log(errorMessage);
    } while (!validate(input));
    return input;
};

// Menjalankan fungsi utama
main();