const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: String,
    description: String,
    img: String,
    price: Number,
    qty: Number
});

const Product = mongoose.model('Store', storeSchema);

module.exports = Product;