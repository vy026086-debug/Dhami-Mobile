const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, // Phone number unique hona chahiye
    password: { type: String, required: true },
    role: { type: String, default: 'customer' }, // 'customer' ya 'admin'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
