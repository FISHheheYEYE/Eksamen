// server.js
const path = require('path');
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json()); // Middleware to parse incoming JSON payloads
app.use(express.static(path.join(__dirname, 'nettside')));

// Middleware: Kun intern tilgang til admin
function internalOnly(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  
  // Juster subnettet til bedriftens nettverk
  if (ip.startsWith('192.168.1.') || ip === '127.0.0.1' || ip === '::1') {
    return next();
  }

  res.status(403).json({ error: 'Adminområdet er kun tilgjengelig fra bedriftens nettverk.' });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'nettside', 'Index.html'));
});

// Example GET route to fetch users from a table
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Product API: hent produkter
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, category, name, description, price, image FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Products query error:', error);
    res.status(500).json({ error: 'Kunne ikke hente produkter' });
  }
});

// Product API: opprett nytt produkt (kun fra internt nettverk)
app.post('/products', internalOnly, async (req, res) => {
  const { category, name, description, price, image } = req.body;
  try {
    const queryText = 'INSERT INTO products (category, name, description, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const result = await pool.query(queryText, [category, name, description, price, image]);
    res.status(201).json({ id: result.rows[0].id, message: 'Produkt lagt til' });
  } catch (error) {
    console.error('Products insert error:', error);
    res.status(500).json({ error: 'Kunne ikke legge til produkt' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
