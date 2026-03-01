// DHAMI MOBILE SHOP - SERVER CODE
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('./models/Product');
const User = require('./models/User');
const Booking = require('./models/Booking');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 1. Database Connection (MongoDB Atlas Cloud)
// Cloud Database se connection - kahin se bhi access ho sakta hai!
const dbURI = "mongodb+srv://Vishal:Dhami@123@cluster0.sx1udbo.mongodb.net/dhamiMobile?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI)
.then(() => {
    console.log("-----------------------------------------");
    console.log("Bhai, Cloud Database (Atlas) Se Connection Pakka! 🚀");
    console.log("-----------------------------------------");
})
.catch(err => {
    console.log("Atlas Connection mein gadbad:", err);
});

// 2. Ek Basic Route (Check karne ke liye)
app.get('/', (req, res) => {
    res.send("Dhami Mobile Shop ka Server Daud Raha Hai!");
});

// Naya Product Add Karne ka Route (Admin ke liye)
app.post('/api/products/add', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product List Ho Gaya Bhai!", savedProduct });
    } catch (err) {
        res.status(500).json({ message: "Kuch gadbad ho gayi!", error: err });
    }
});

// Saare Products Dekhne ka Route (User ke liye)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Product Delete Karne ka Route (Admin ke liye)
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found!" });
        }
        res.json({ message: "Product deleted successfully!", product: deletedProduct });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product!", error: err.message });
    }
});

// ==================== AUTHENTICATION ROUTES ====================

// SIGNUP - Naya user account banane ke liye
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "Ye phone number pehle se registered hai!" });
        }
        
        // Password hash karna (security ke liye)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Naya user create karna
        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            role: 'customer'
        });
        
        const savedUser = await newUser.save();
        res.status(201).json({ 
            message: "Account successfully ban gya bhai!", 
            user: { id: savedUser._id, name: savedUser.name, phone: savedUser.phone } 
        });
    } catch (err) {
        res.status(500).json({ message: "Signup mein dikkat hai!", error: err.message });
    }
});

// LOGIN - User login karne ke liye
app.post('/api/auth/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        // User find karna
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "Phone number ya password galat hai!" });
        }
        
        // Password check karna
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Phone number ya password galat hai!" });
        }
        
        // SECURITY FIX: Sirf 8307968872 hi admin banega
        let role = 'customer';
        if (user.phone === '8307968872') {
            role = 'admin';
        }
        
        // JWT token generate karna (session ke liye)
        const token = jwt.sign(
            { id: user._id, role: role },
            'dhami123', // Secret key (task ke according)
            { expiresIn: '1d' } // 1 din tak valid
        );
        
        res.json({ 
            message: "Login successful bhai!", 
            token,
            user: { id: user._id, name: user.name, phone: user.phone, role: role }
        });
    } catch (err) {
        res.status(500).json({ message: "Login mein dikkat hai!", error: err.message });
    }
});

// ==================== BOOKING ROUTES ====================

// Nayi Appointment Book Karne ka Route
app.post('/api/bookings/add', async (req, res) => {
    try {
        const { user, mobileModel, problem, bookingDate, bookingTime } = req.body;
        
        console.log("📥 Booking Request Aaya:", req.body);

        const newBooking = new Booking({
            user,
            mobileModel,
            problem,
            bookingDate,
            bookingTime
        });

        const savedBooking = await newBooking.save();
        console.log("✅ Booking Save Ho Gayi:", savedBooking._id);
        res.status(201).json({ message: "Bhai, Appointment Book Ho Gayi!", savedBooking });
    } catch (err) {
        console.error("❌ Booking Error:", err.message);
        console.error("Full Error:", err);
        res.status(500).json({ message: "Booking mein gadbad hui!", error: err.message });
    }
});

// Admin ke liye: Saari Bookings Dekhne ka Route
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name phone'); // User ki details bhi dikhayega
        res.json(bookings);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update Booking Status (Admin ke liye)
app.put('/api/bookings/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        ).populate('user', 'name phone');
        
        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found!" });
        }
        
        res.json({ message: "Status updated!", booking: updatedBooking });
    } catch (err) {
        res.status(500).json({ message: "Error updating status!", error: err.message });
    }
});

// 3. Port Setting
const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Bhai, server 5005 par daud raha hai!`);
});
