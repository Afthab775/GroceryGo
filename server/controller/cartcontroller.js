const Cart = require('../models/cartmodel')
const Product = require("../models/productmodel")

// 🔹 Add item to cart
 const addToCart = async (req, res) => {
  try {
    const userId = req.userID.id;   // << GET USER ID FROM TOKEN
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }

    const product = await Product.findById(productId)

    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    if(product.product_quantity <= 0){
      return res.status(404).json({ message: "Product out of  stock" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, qty: 1 }],
      });
      return res.json({ success: true, message: "Added to cart", cart });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      if(cart.items[itemIndex].qty +1 >product.product_quantity){
        return res.status(400).json({message: `Only ${product.product_quantity} available in stock`,});
      }
      cart.items[itemIndex].qty += 1;
    } else {
      cart.items.push({ productId, qty: 1 });
    }

    await cart.save();
    res.json({ success: true, message: "Added to cart", cart });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};


// 🔹 Get user cart
 const getUserCart = async (req, res) => {
  try {
    const userId = req.userID.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) return res.json({ items: [] });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// 🔹 Update product quantity (increase / decrease)
 const updateCartQty = async (req, res) => {
  try {
    const userId = req.userID.id;
    const { productId, qty } = req.body;

    if(qty < 0){
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const product = await Product.findById(productId)

    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    if(qty >product.product_quantity){
        return res.status(400).json({message: `Only ${product.product_quantity} available in stock`,});
      }

    let cart = await Cart.findOne({ userId });

    if (!cart){
      return res.status(404).json({ message: "Cart not found" });
    } 

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    if (qty===0) {
      cart.items.splice(itemIndex,1);
    }else{
      cart.items[itemIndex].qty = qty;
    }
    await cart.save();
    res.json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// 🔹 Remove product from cart
 const removeCartItem = async (req, res) => {
  try {
    const userId = req.userID.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({ success: true, message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const clearCart = async(req,res)=>{
  try {
    const userId = req.userID.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ success: true, message: "Cart already empty" });
    }

    cart.items = [];
    await cart.save();
    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
}

module.exports = {addToCart,getUserCart,updateCartQty,removeCartItem,clearCart}
