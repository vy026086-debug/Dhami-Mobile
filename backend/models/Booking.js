const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Kisne book kiya
    mobileModel: { type: String, required: true }, // Kaunsa phone hai (e.g., Vivo V20)
    problem: { type: String, required: true }, // Kya dikkat hai (e.g., Display Break)
    bookingDate: { type: String, required: true }, // Kis din aayega
    bookingTime: { type: String, required: true }, // Kis time aayega
    status: { type: String, default: 'Pending' }, // Pending, Confirmed, ya Repaired
    expiryDate: { 
        type: Date, 
        default: () => new Date(+new Date() + 2*24*60*60*1000) // Aaj se thik 2 din baad
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
