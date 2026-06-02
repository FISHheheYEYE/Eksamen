// server.js
const path = require('path');
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'nettside')));

// Middleware: Kun intern tilgang til admin
function internalOnly(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  
  // Godtar localhost og bedriftens nettverk
  if (ip.startsWith('192.168.1.') || ip === '127.0.0.1' || ip === '::1' || ip.includes('127.0.0.1') || ip === 'localhost') {
    return next();
  }

  res.status(403).json({ error: 'Adminområdet er kun tilgjengelig fra bedriftens nettverk.' });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'nettside', 'Index.html'));
});

// Product API: hent produkter (fra PostgreSQL)
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Feil ved henting av produkter:', error);
    res.status(500).json({ error: 'Feil ved henting av produkter' });
  }
});

// Product API: opprett nytt produkt (kun fra internt nettverk)
app.post('/products', internalOnly, async (req, res) => {
  const { category, name, description, price, image } = req.body;

  if (!category || !name || !description || !price) {
    return res.status(400).json({ error: 'Manglende obligatoriske felt' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (category, name, description, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [category, name, description, Number(price), image || 'https://via.placeholder.com/600x400?text=Produkt']
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Produkt lagt til' });
  } catch (error) {
    console.error('Feil ved opprettelse av produkt:', error);
    res.status(500).json({ error: 'Feil ved opprettelse av produkt' });
  }
});

// Product API: slett produkt (kun fra internt nettverk)
app.delete('/products/:id', internalOnly, async (req, res) => {
  const productId = Number(req.params.id);

  if (!productId || Number.isNaN(productId)) {
    return res.status(400).json({ error: 'Ugyldig produkt-ID' });
  }

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [productId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Produkt ikke funnet' });
    }
    res.json({ id: result.rows[0].id, message: 'Produkt slettet' });
  } catch (error) {
    console.error('Feil ved sletting av produkt:', error);
    res.status(500).json({ error: 'Feil ved sletting av produkt' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
  console.log('Produkter lagres i PostgreSQL-databasen');
});