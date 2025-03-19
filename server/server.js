const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

const port = 5000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'MARKETING_FORMS',
    port: 3306
});

// Establish connection to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Sample POST endpoint to insert data
app.post('/api/forms', (req, res) => {
    const { form_id, created_at, updated_at} = req.body;
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    
    db.query(sql, [name, email], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send({ error: 'Failed to insert data' });
        }
        res.status(201).send({ message: 'User inserted', id: result.insertId });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});