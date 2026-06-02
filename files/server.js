// server.js
const path = require('path');
const express = require('express');
const fs = require('fs');

// ENKEL VERSJON MED JSON-FILER (uten PostgreSQL)
// Denne versjonen lagrer produkter i products.json i stedet for database
// Når du får PostgreSQL til å fungere, kan du bytte til db.js

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'nettside')));

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Hjelp-funksjon for å lese produkter fra JSON
function readProducts() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Feil ved lesing av produkter:', error);
    return [];
  }
}

// Hjelp-funksjon for å lagre produkter til JSON
function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Feil ved lagring av produkter:', error);
  }
}

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

// Product API: hent produkter (fra JSON-fil)
app.get('/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Product API: opprett nytt produkt (kun fra internt nettverk)
app.post('/products', internalOnly, (req, res) => {
  const { category, name, description, price, image } = req.body;

  if (!category || !name || !description || !price) {
    return res.status(400).json({ error: 'Manglende obligatoriske felt' });
  }

  const products = readProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

  const newProduct = {
    id: newId,
    category,
    name,
    description,
    price: Number(price),
    image: image || 'https://via.placeholder.com/600x400?text=Produkt'
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json({ id: newId, message: 'Produkt lagt til' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
  console.log('Produkter lagres i: products.json');
  console.log('(Når PostgreSQL fungerer, can du bytte til database)');
});
