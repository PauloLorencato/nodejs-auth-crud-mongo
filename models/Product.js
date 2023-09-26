const mongoose = require('mongoose')

const Product = mongoose.model('Product', {
    productName: String,
    owner: String,
    caracs: Array,
})

module.exports = Product