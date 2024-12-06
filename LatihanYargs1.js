const yargs = require("yargs");
const fs = require('fs');
const { saveContact, DeleteContact } = require("./src/func");

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
    console.log(`Kontak ${contact.name} berhasil ditambahkan!`);
    console.log(contact);
  },
});

yargs.command({
  command: "delete",
  describe: "Delete Contact by Name",
  builder: {
    name: {
      describe: "Contact Name Delete",
      demandOption: true,
      type: "string",
    },
  },

  handler(argv) {
    DeleteContact(argv);
    console.log(`Menghapus kontak dengan nama: ${argv.name}`);
  }
});

yargs.parse();