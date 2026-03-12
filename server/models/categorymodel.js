const mongoose = require('mongoose')
const categorymodel = new mongoose.Schema({
    category_name:{type:String},
    category_image:{type:String}
})

module.exports = mongoose.model('Category',categorymodel)