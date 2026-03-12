const mongoose = require('mongoose')
const ordermodel = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    items: Array,
    address: Object,
    paymentMethod: String,
    itemsTotal: Number,
    deliveryCharge: Number,
    handlingCharge: Number,
    grandTotal: Number,
    status:{
        type: String,
        enum: ["Placed","Packed","Out for Delivery","Delivered","Cancelled"],
        default: "Placed",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    }
},
{timestamps:true}
)
module.exports = mongoose.model('Orders',ordermodel)