const express = require("express");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const cors = require("cors");
const multer = require('multer');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

const con = mysql.createPool({
    connectionLimit: 10,
    user: "root",
    host: "localhost",
    password: "Admin@123",
    database: "register"
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/image');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/signup', (req, res) => {
    const { email, username, password } = req.body;

    con.query("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", [email, username, password], 
        (err, result) => {
            if (err) {
                console.error("Error inserting user:", err);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                console.log("User registered successfully");
                res.status(200).json(result);
            }
        }
    );
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    con.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], 
        (err, result) => {
            if (err) {
                console.error("Error querying user:", err);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                if (result.length > 0) {
                    res.status(200).json(result);
                } else {
                    res.status(401).json({ message: "Wrong username or password" });
                }
            }
        }
    );
});

app.post('/api/form', upload.single('uploadFile'), (req, res) => {
    const { email, username, type, amount, date } = req.body;
    const uploadFile = req.file ? req.file.filename : null;

    if (!uploadFile) {
        console.error("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded file:", uploadFile); // Add this line

    con.query("INSERT INTO form (email, type, amount, date, uploadFile) VALUES (?, ?, ?, ?, ?)", [email, type, amount, date, uploadFile],
        (err, result) => {
            if (err) {
                console.error("Error inserting form data:", err);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                console.log("Form data inserted successfully");
                res.status(200).json(result);
            }
        }
    );
});


app.get('/api/formdata', (req, res) => {
    console.log("fetching data");
    con.query("SELECT * FROM form", (err, result) => {
        if (err) {
            console.error("Error fetching form data:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('/form/:email', (req, res) => {
    const email = req.params.email;
    const query = "SELECT type, amount, date, uploadFile FROM form WHERE email = ?";

    con.query(query, [email], (err, result) => {
        if (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).json({ error: "Error fetching user data" });
        }
        console.log("Fetched user data:", result);
        res.status(200).json(result);
    });
});

app.listen(3001, () => {
    console.log("Running backend server on port 3001");
});
