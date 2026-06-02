// server.js
const path = require('path');
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json()); // Middleware to parse incoming JSON payloads
app.use(express.static(path.join(__dirname, 'nettside')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'nettside', 'Index.html'));
});

// Example GET route to fetch data from a table
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example POST route to insert data into a table
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const queryText = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id';
    const result = await pool.query(queryText, [name, email]);
    res.status(201).json({ id: result.rows[0].id, message: 'User added successfully' });
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
