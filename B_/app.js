const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// Landing page
app.get('/', (req, res) => {
    res.render('index');
});

// Insert student
app.post('/students', async (req, res) => {
    const { usn, name, subject_code, cie } = req.body;
    try {
        await db.collection('students').insertOne({ usn, name, subject_code, cie });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding student: ' + error.message);
    }
});

// Update student marks
app.post('/students/update', async (req, res) => {
    const { usn, cie } = req.body;
    try {
        await db.collection('students').updateOne({ usn }, { $set: { cie } });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error updating student: ' + error.message);
    }
});

// Delete student marks
app.post('/students/delete', async (req, res) => {
    const { usn } = req.body;
    try {
        await db.collection('students').deleteOne({ usn });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting student: ' + error.message);
    }
});

// Display students with CIE < 20
app.get('/students/low-cie', async (req, res) => {
    try {
        const students = await db.collection('students').find({ cie: { $lt: 20 } }).toArray();
        res.render('low_cie', { students });
    } catch (error) {
        res.status(500).send('Error retrieving students: ' + error.message);
    }
});

// Serve the insert page
app.get('/insert', (req, res) => {
    res.render('insert');
});

// Serve the update page
app.get('/update', (req, res) => {
    res.render('update');
});

// Serve the delete page
app.get('/delete', (req, res) => {
    res.render('delete');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
