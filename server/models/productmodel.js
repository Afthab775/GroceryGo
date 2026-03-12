const mongoose = require('mongoose')
const productmodel = new mongoose.Schema({
    product_name:{type:String},
    product_description:{type:String},
    product_price:{type:Number},
    product_quantity:{type:Number},
    product_unit:{type:String},
    product_image:{type:String},
    categoryID:{type:mongoose.Schema.Types.ObjectId,ref:'Category'},
    subcategoryID: {type:mongoose.Schema.Types.ObjectId,ref:'SubCategory'}
})
module.exports = mongoose.model('Products',productmodel)