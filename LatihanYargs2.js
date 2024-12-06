const yargs = require("yargs");
const fs = require('fs');
const { saveContact, loadContacts, DeleteContact } = require("./src/func");
const filePath = ('data/contacts.json');
const func = require ("./src/func");





yargs.command({
  command: "add",
  describe: "add new contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true,
      type: "string",
    },
    mobile: {
      describe: "contact mobile",
      demandOption: true,
      type: "string",
    },
    email: {
      describe: "contact email",
      demandOption: false,
      type: "string",
    },
    
  },

  handler(argv) {
    const contact = {
      name: argv.name,
      mobile: argv.mobile,
      email: argv.email,
    };
    saveContact(contact);
    console.log(contact);
  },
});

  yargs.command({
    command: "delete",
    describe: "Delete Contact",
    builder: {
      name: {
        describe: "Delete Contact by Name",
        demandOption: true,
        type: "string",
      },
    },

    handler(argv){
      DeleteContact(argv);
      console.log(argv.name);

      // if (conts.length === filteredContacts.length) {
      //     console.log(`Data dengan nama :"${argv.name}" Tidak Ditemukan`);
      // } else {

      //   saveContact(filteredContacts);
      //   console.log(`Data dengan nama : "${argv.name}"Telah Di Delete. `);
      //}
    }
  });

  // yargs.command({
  //   command: "list",
  //   describe: "List Data",
  //   option: {list, {
  //       name: {
  //       describe: "Daftar Data",
  //       demandOption: true,
  //       type: "array",
  //     }},
  //   },

  //   // handler(argv){
  //   //   DeleteContact(argv);
  //   //   console.log(argv.name);
  //   // }
  // });


  yargs.command({
    command: "list",
    describe: "List all contacts",
   
    handler() {
      // Membaca data kontak dari file JSON
      loadContacts();
    },
   });

   yargs.command({
    command: "detail",
    describe: "Show detail contacts by name",
    builder: {
      name: {
        describe: "Detail data contact",
        demandOption: true,
        type: "string",
      }
    },
      handler(argv) {
        const contacts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const contact = contacts.find(
          (contacts) => contacts.name.toLowerCase() === argv.name.toLowerCase()
        );
    
        if (contact) {
          console.log("Detail Contact:");
          console.log(`Name: ${contact.name}`);
          console.log(`Mobile: ${contact.mobile}`);
          console.log(`Email: ${contact.email || "No Email"}`);
        } else {
          console.log(`Kontak dengan nama "${argv.name}" tidak ditemukan.`);
        }
      }
   });


yargs.parse();
func.rl.close();







// // Fungsi untuk menambahkan kontak baru ke file JSON
//   const filePath = 'data/contacts.json'; // Lokasi file kontak
  
//   // Membaca data dari file JSON atau menginisialisasi array kosong jika file tidak ada
//       const contacts = fs.existsSync(filePath) ? 
//       JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];

//   contacts.push(yargs.argv); // Menambahkan kontak baru ke dalam array
//   fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), 'utf-8'); // Menulis kembali data ke file
