const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'studentDB';
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName);
        console.log('Connected to Database');
    })
    .catch(error => console.error(error));

// Endpoint to add student data
app.post('/students', async (req, res) => {
    const { usn, name, subject_code, cie } = req.body;
    try {
        await db.collection('students').insertOne({ usn, name, subject_code, cie });
        res.status(201).send('Student added successfully');
    } catch (error) {
        res.status(500).send('Error adding student: ' + error.message);
    }
});

// Endpoint to retrieve students with CIE < 20
app.get('/students/low-cie', async (req, res) => {
    try {
        const students = await db.collection('students').find({ cie: { $lt: 20 } }).toArray();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).send('Error retrieving students: ' + error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
