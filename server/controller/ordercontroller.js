const Order = require("../models/ordermodel")
const Cart = require("../models/cartmodel")
const Product = require("../models/productmodel");

const createOrder = async(req,res)=>{
    try {
        const userId = req.userID.id;

        const { address, paymentMethod } = req.body;

        const cart = await Cart.findOne({userId}).populate("items.productId");

        if(!cart || cart.items.length===0){
            return res.status(400).json({ message: "Cart is empty" });
        }

        //check stock before order
        for(let item of cart.items){
            if(item.qty > item.productId.product_quantity){
                return res.status(400).json({message: `Not enough stock for ${item.productId.product_name}`,});
            }
        }

        let itemsTotal = 0;
        //create order
        const orderItems = cart.items.map((item) =>{
            const price = item.productId.product_price;
            itemsTotal += price*item.qty;
            return{
                productId: item.productId._id,
                product_name: item.productId.product_name,
                product_price: price,
                product_image: item.productId.product_image,
                product_unit: item.productId.product_unit,
                qty: item.qty
            }
        });

        const freeDeliveryLimit = 149;
        const deliveryCharge = itemsTotal >= freeDeliveryLimit ? 0 : 29;
        const handlingCharge = 2;

        const grandTotal = itemsTotal + deliveryCharge + handlingCharge;

        //deduct stock
        for(let item of cart.items){
            await Product.findByIdAndUpdate(item.productId._id,{
                $inc: {product_quantity: -item.qty}
            });
        }
        
        const order = await Order.create({
            userId,
            items: orderItems,
            address,
            paymentMethod,
            itemsTotal,
            deliveryCharge,
            handlingCharge,
            grandTotal,
            status: "Placed",
            paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        });

        cart.items = [];
        await cart.save();
        res.json({ success: true, message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all orders of logged-in user
const getMyOrders = async (req, res) => {
    try {
        const userId = req.userID.id;

        const orders = await Order.find({ userId })
            .populate("items.productId")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single order details
const getOrderById = async (req, res) => {
    try {
        const userId = req.userID.id;
        const { id } = req.params;

        const order = await Order.findOne({ _id: id, userId }).populate("items.productId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id).populate("items.productId");

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async(req,res) => {
    try {
        const orders = await Order.find()
        .populate("userId","name email")
        .populate("items.productId")
        .sort({ createdAt: -1 });

        res.json({success:true,orders});

    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const updateOrderStatus = async(req,res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if(!order){
            return res.status(404).json({message:"Order not found"});
        }

        order.status = status;

        if(order.paymentMethod === "cod" && status === "Delivered"){
            order.paymentStatus = "paid";
        }

        if(status === "Cancelled") {
            for(let item of order.items){
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { product_quantity: item.qty } }
                );
            }
            order.paymentStatus = "failed";
        }

        await order.save();

        res.json(order);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const cancelOrder = async (req,res) => {
    try {

        const userId = req.userID.id;
        const { id } = req.params;

        const order = await Order.findOne({_id:id, userId});

        if(!order){
            return res.status(404).json({message:"Order not found"});
        }

        if(order.status !== "Placed"){
            return res.status(400).json({message:"Order cannot be cancelled"});
        }

        // restore stock
        for(let item of order.items){
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { product_quantity: item.qty } }
            );
        }

        order.status = "Cancelled";
        order.paymentStatus = "failed"
        await order.save();

        res.json({success:true,message:"Order cancelled",order});

    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

module.exports = {createOrder,getMyOrders,getOrderById,getOrderByIdAdmin,getAllOrders,updateOrderStatus,cancelOrder}