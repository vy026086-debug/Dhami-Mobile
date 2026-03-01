const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Product ka naam (e.g., iPhone 13, Vivo V20 Folder)
    description: { type: String }, // Details (e.g., Original battery, 6 months warranty)
    price: { type: Number, required: true }, // Kimat
    category: { 
        type: String, 
        required: true,
        enum: ['Mobile', 'Accessories', 'Repairing', 'Old-Mobile'] // Inhi categories mein se hoga
    },
    subCategory: { type: String }, // Jaise: 'Folder', 'IC', 'Charger', 'Cover'
    image: { type: String }, // Photo ka link
    stock: { type: Number, default: 1 }, // Kitne piece bache hain
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
