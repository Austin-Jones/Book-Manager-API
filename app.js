// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { expressjwt: expressJwt } = require("express-jwt");
const crypto = require('crypto');
const cors = require('cors')
const SECRET_KEY = crypto.randomBytes(64).toString('hex');
const corsOptions = {
    origin: ["http://localhost:3000"],
  }
const app = express();
app.use(bodyParser.json());
app.use(expressJwt({ secret: SECRET_KEY, algorithms: ['HS256'] }).unless({ path: ['/login', '/register'] }));
app.use(cors(corsOptions))

// Register a new user
app.post('/register', (req, res, next) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User registered successfully' });
        }
    );
});

// Login and get a token
app.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '12h' });
        res.json({ token });
    });
});

// Create a new book
app.post('/books', (req, res, next) => {
    const { title, author, published_date, isbn, pages, cover_url, language } = req.body;
    db.run(
        'INSERT INTO books (title, author, published_date, isbn, pages, cover_url, language) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, author, published_date, isbn, pages, cover_url, language],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, ...req.body });
        }
    );
});

// Retrieve a list of all books
app.get('/books', (req, res, next) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Retrieve a single book by ID
app.get('/books/:id', (req, res, next) => {
    const { id } = req.params;
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(row);
    });
});

// Update an existing book
app.put('/books/:id', (req, res, next) => {
    const { id } = req.params;
    const { title, author, published_date, isbn, pages, cover_url, language } = req.body;
    db.run(
        'UPDATE books SET title = ?, author = ?, published_date = ?, isbn = ?, pages = ?, cover_url = ?, language = ? WHERE id = ?',
        [title, author, published_date, isbn, pages, cover_url, language, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.json({ id, ...req.body });
        }
    );
});

// Delete a book
app.delete('/books/:id', (req, res, next) => {
    const { id } = req.params;
    db.run('DELETE FROM books WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(204).end();
    });
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        if (err.message === 'jwt expired') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid or missing token' });
    }
    next(err);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
