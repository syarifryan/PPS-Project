// server.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lost_and_found'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Endpoint untuk mendapatkan semua item
app.get('/api/items', (req, res) => {
  console.log('Fetching items from database'); // Tambahkan logging ini
  db.query('SELECT * FROM items', (err, results) => {
    if (err) {
      console.error('Database error:', err); // Tambahkan logging ini
      res.status(500).send(err);
    } else {
      console.log('Items fetched successfully:', results); // Tambahkan logging ini
      res.json(results);
    }
  });
});


// Endpoint untuk mendapatkan item by id
app.get('/api/items/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Fetching item with ID: ${id}`); // Tambahkan logging ini
  db.query('SELECT * FROM items WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Tambahkan logging ini
      res.status(500).send(err);
    } else if (result.length === 0) {
      console.log('Item not found'); // Tambahkan logging ini
      res.status(404).send('Item not found');
    } else {
      console.log('Item found:', result[0]); // Tambahkan logging ini
      res.json(result[0]);
    }
  });
});



app.post('/api/items', upload.single('image'), (req, res) => {
  const { name, owner, details, location, date } = req.body;
  const image = `/uploads/${req.file.filename}`;
  db.query('INSERT INTO items (name, owner, details, location, date, image) VALUES (?, ?, ?, ?, ?, ?)', 
    [name, owner, details, location, date, image], (err, result) => {
    if (err) {
      console.error('Error adding item:', err); // Log error
      res.status(500).send('Error adding item');
    } else {
      res.status(201).send({ id: result.insertId, name, owner, details, location, date, image });
    }
  });
});

// Endpoint untuk memperbarui item berdasarkan ID
app.put('/api/items/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, owner, details, location, date } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  console.log('ID:', id);
  console.log('Data:', { name, owner, details, location, date, image });

  const query = image
    ? 'UPDATE items SET name = ?, owner = ?, details = ?, location = ?, date = ?, image = ? WHERE id = ?'
    : 'UPDATE items SET name = ?, owner = ?, details = ?, location = ?, date = ? WHERE id = ?';

  const values = image
    ? [name, owner, details, location, date, image, id]
    : [name, owner, details, location, date, id];

  console.log('Query:', query);
  console.log('Values:', values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating item:', err);
      res.status(500).json({ error: 'Error updating item', details: err });
    } else {
      res.json({ message: 'Item updated successfully' });
    }
  });
});


// Endpoint untuk menghapus item berdasarkan ID
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting item:', err);
      res.status(500).json({ error: 'Error deleting item' });
    } else {
      res.sendStatus(200);
    }
  });
});



// FORM LAPORAN HILANG
// Endpoint untuk menambahkan laporan kehilangan baru
app.post('/api/reports', upload.single('image'), (req, res) => {
  const { name, email, phone, status, nrp, faculty, details, location } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  db.query('INSERT INTO lost_reports (name, email, phone, status, nrp, faculty, details, location, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [name, email, phone, status, nrp, faculty, details, location, image_path], (err, result) => {
    if (err) {
      console.error('Error adding report:', err);
      res.status(500).json({ error: 'Error adding report' });
    } else {
      res.status(201).json({ id: result.insertId, name, email, phone, status, nrp, faculty, details, location, image_path });
    }
  });
});

// Endpoint untuk memperbarui laporan kehilangan berdasarkan ID
app.put('/api/reports/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, email, phone, status, nrp, faculty, details, location } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : req.body.image_path;

  db.query('UPDATE lost_reports SET name = ?, email = ?, phone = ?, status = ?, nrp = ?, faculty = ?, details = ?, location = ?, image_path = ? WHERE id = ?', 
    [name, email, phone, status, nrp, faculty, details, location, image_path, id], (err) => {
    if (err) {
      console.error('Error updating report:', err);
      res.status(500).json({ error: 'Error updating report' });
    } else {
      res.sendStatus(200);
    }
  });
});

// Endpoint untuk menghapus laporan kehilangan berdasarkan ID
app.delete('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM lost_reports WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting report:', err);
      res.status(500).json({ error: 'Error deleting report' });
    } else {
      res.sendStatus(200);
    }
  });
});


// PORT
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
