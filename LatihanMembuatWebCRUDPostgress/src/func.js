const pool = require("./conn/db_contacts");


async function readContacts() {
  try {
    const result = await pool.query('SELECT * FROM data_contacts ORDER BY id ASC');
    return result.rows; // Mengembalikan hasil query
  } catch (err) {
    console.error('Error fetching contacts:', err);
    throw err; // Lempar error untuk ditangani pemanggil
  }
};


// Fungsi untuk menghapus kontak berdasarkan ID
async function deleteContact(id) {
    try {
      const result = await pool.query('DELETE FROM data_contacts WHERE id = $1', [id]);
      return result.rowCount > 0; // Mengembalikan true jika ada baris yang dihapus
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw new Error('Database error');
    }
  }
  

  async function addContact (name, mobile, email) {
    try {
      const result = await pool.query(
      "INSERT INTO data_contacts (Name, Mobile, Email) VALUES ($1, $2, $3)",[name, mobile, email]);
      return result.rowCount > 0; // Mengembalikan true jika data berhasil ditambahkan
    } catch (err) {
      console.error('Error adding contact:', err);
      throw err; // Lempar error untuk ditangani di tempat lain
    }
  };

  module.exports = {
    deleteContact, addContact, readContacts
  };
  