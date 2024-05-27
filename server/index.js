// const express = require("express");
// const mysql = require("mysql");
// const bodyParser = require('body-parser');
// const cors = require("cors");
// const multer = require('multer');
// const path = require('path');
// const WebSocket = require('ws');

// const app = express();

// app.use(bodyParser.json());
// app.use(cors());

// // Serve static files from the "public" directory
// app.use('/public', express.static(path.join(__dirname, 'public')));

// // MySQL connection pool
// const con = mysql.createPool({
//     connectionLimit: 10,
//     user: "root",
//     host: "localhost",
//     password: "Admin@123",
//     database: "register"
// });

// // Multer setup for file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/image');
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// // WebSocket setup
// const wss = new WebSocket.Server({ port: 3002 });

// // Signup route
// app.post('/signup', (req, res) => {
//     const { email, username, password } = req.body;

//     con.query("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", [email, username, password], 
//         (err, result) => {
//             if (err) {
//                 console.error("Error inserting user:", err);
//                 res.status(500).json({ error: "Internal Server Error" });
//             } else {
//                 console.log("User registered successfully");
//                 res.status(200).json(result);
//             }
//         }
//     );
// });

// // Login route
// app.post("/login", (req, res) => {
//     const { email, password } = req.body;
//     con.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], 
//         (err, result) => {
//             if (err) {
//                 console.error("Error querying user:", err);
//                 res.status(500).json({ error: "Internal Server Error" });
//             } else {
//                 if (result.length > 0) {
//                     res.status(200).json(result);
//                 } else {
//                     res.status(401).json({ message: "Wrong username or password" });
//                 }
//             }
//         }
//     );
// });

// // Form submission route
// app.post('/api/form', upload.single('uploadFile'), (req, res) => {
//     const { email, type, amount, date } = req.body;
//     const uploadFile = req.file ? req.file.filename : null;

//     if (!uploadFile) {
//         console.error("No file uploaded");
//         return res.status(400).json({ error: "No file uploaded" });
//     }

//     console.log("Uploaded file:", uploadFile); // Add this line

//     con.query("INSERT INTO form (email, type, amount, date, uploadFile,status) VALUES (?, ?, ?, ?, ?, 'pending')", [email, type, amount, date, uploadFile],
//         (err, result) => {
//             if (err) {
//                 console.error("Error inserting form data:", err);
//                 res.status(500).json({ error: "Internal Server Error" });
//             } else {
//                 console.log("Form data inserted successfully");
//                 res.status(200).json(result);


//                 wss.clients.forEach((client) =>{
//                     if(client.readyState === WebSocket.OPEN){
//                         client.send(JSON.stringify({id:result.insertId,status:'pending'}));
//                     }
//                 });
//             }
//         }
//     );
// });

// // Update form status route
// app.put('/api/form/status', (req, res) => {
//     const { id, status } = req.body;

//     con.query("UPDATE form SET status = ? WHERE id = ?", [status, id], 
//         (err, result) => {
//             if (err) {
//                 console.error("Error updating status:", err);
//                 res.status(500).json({ error: "Internal Server Error" });
//             } else {
//                 res.status(200).json(result);

//                 // WebSocket broadcast
//                 wss.clients.forEach((client) => {
//                     if (client.readyState === WebSocket.OPEN) {
//                         client.send(JSON.stringify({ id, status }));
//                     }
//                 });
//             }
//         }
//     );
// });

// // Fetch all form data
// app.get('/api/formdata', (req, res) => {
//     console.log("Fetching data");
//     con.query("SELECT * FROM form", (err, result) => {
//         if (err) {
//             console.error("Error fetching form data:", err);
//             res.status(500).json({ error: "Internal Server Error" });
//         } else {
//             res.status(200).json(result);
//         }
//     });
// });

// // Fetch user-specific form data
// app.get('/form/:email', (req, res) => {
//     const email = req.params.email;
//     const query = "SELECT type, amount, date, uploadFile, status FROM form WHERE email = ?";

//     con.query(query, [email], (err, result) => {
//         if (err) {
//             console.error("Error fetching user data:", err);
//             return res.status(500).json({ error: "Error fetching user data" });
//         }
//         console.log("Fetched user data:", result);
//         res.status(200).json(result);
//     });
// });

// // Start server
// app.listen(3001, () => {
//     console.log("Running backend server on port 3001");
// });


const express = require("express");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const WebSocket = require('ws');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// MySQL connection pool
const con = mysql.createPool({
    connectionLimit: 10,
    user: "root",
    host: "localhost",
    password: "Admin@123",
    database: "register"
});

// Multer setup for file storage
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

// WebSocket setup
const wss = new WebSocket.Server({ port: 3002 });

// Signup route
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

// Login route
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

// Form submission route
app.post('/api/form', upload.single('uploadFile'), (req, res) => {
    const { email, type, amount, date } = req.body;
    const uploadFile = req.file ? req.file.filename : null;

    if (!uploadFile) {
        console.error("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded file:", uploadFile); // Add this line

    con.query("INSERT INTO form (email, type, amount, date, uploadFile, status) VALUES (?, ?, ?, ?, ?, 'pending')", [email, type, amount, date, uploadFile],
        (err, result) => {
            if (err) {
                console.error("Error inserting form data:", err);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                console.log("Form data inserted successfully");
                res.status(200).json(result);

                wss.clients.forEach((client) =>{
                    if(client.readyState === WebSocket.OPEN){
                        client.send(JSON.stringify({id:result.insertId, status:'pending'}));
                    }
                });
            }
        }
    );
});

// Update form status route
app.put('/api/form/status', (req, res) => {
    const { id, status } = req.body;

    con.query("UPDATE form SET status = ? WHERE id = ?", [status, id], 
        (err, result) => {
            if (err) {
                console.error("Error updating status:", err);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                res.status(200).json(result);

                // WebSocket broadcast
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ id, status }));
                    }
                });
            }
        }
    );
});

// Fetch all form data
app.get('/api/formdata', (req, res) => {
    console.log("Fetching data");
    con.query("SELECT * FROM form", (err, result) => {
        if (err) {
            console.error("Error fetching form data:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.status(200).json(result);
        }
    });
});

// Fetch user-specific form data
app.get('/form/:email', (req, res) => {
    const email = req.params.email;
    const query = "SELECT type, amount, date, uploadFile, status FROM form WHERE email = ?";

    con.query(query, [email], (err, result) => {
        if (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).json({ error: "Error fetching user data" });
        }
        console.log("Fetched user data:", result);
        res.status(200).json(result);
    });
});

// Accept form route
app.post('/api/formdata/:id/accept', (req, res) => {
    const { id } = req.params;

    con.query("UPDATE form SET status = 'accepted' WHERE id = ?", [id], 
        (err, result) => {
            if (err) {
                console.error("Error accepting form:", err);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                res.status(200).json(result);

                // WebSocket broadcast
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ id, status: 'accepted' }));
                    }
                });
            }
        }
    );
});

// Reject form route
app.post('/api/formdata/:id/reject', (req, res) => {
    const { id } = req.params;

    con.query("UPDATE form SET status = 'rejected' WHERE id = ?", [id], 
        (err, result) => {
            if (err) {
                console.error("Error rejecting form:", err);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                res.status(200).json(result);

                // WebSocket broadcast
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ id, status: 'rejected' }));
                    }
                });
            }
        }
    );
});

// Start server
app.listen(3001, () => {
    console.log("Running backend server on port 3001");
});
