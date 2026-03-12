const mongoose = require('mongoose')
const adminmodel = new mongoose.Schema({
    email:{type:String},
    password:{type:String},
})
module.exports = mongoose.model('Admin',adminmodel)