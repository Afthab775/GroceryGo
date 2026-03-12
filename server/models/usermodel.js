const mongoose = require('mongoose')
const usermodel = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    phone:{type:Number},
},
{ timestamps: true })
module.exports = mongoose.model('Users',usermodel)