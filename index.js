const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST","DELETE","PUT"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads',express.static('./uploads'))

const connectionString = process.env.DATABASE;

mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("mongodb atlas connected to ems server");
}).catch((err) => {
    console.error("Failed in mongodb atlas connection to ems server", err);
});

// Register a new user
app.post("/register", (req, res) => {
    UserModel.create(req.body)
        .then(user => res.json({ success: true, message: "User registered successfully" }))
        .catch(err => res.status(400).json({ success: false, message: err.message }));
});

// Login 
app.post("/", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    const token = jwt.sign({ email: user.email }, "jwt-secret-key", { expiresIn: "1d" });
                    res.cookie("token", token);
                    res.json({ success: true, message: "Login successful" });
                } else {
                    res.status(401).json({ success: false, message: "Incorrect password" });
                }
            } else {
                res.status(404).json({ success: false, message: "User not found" });
            }
        })
        .catch(err => res.status(500).json({ success: false, message: "Internal server error" }));
});



// Middleware to verify 
const verifyToken = (req, res, next) => {
    // Extract token from cookies
    const token = req.cookies.token;

    
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed: Token not provided' });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        req.user = decoded;

       
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }
};

app.get('/home', verifyToken, (req, res) => {
    return res.json({ success: true, message: "Success" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
