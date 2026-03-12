const express = require('express')
const {addToCart,getUserCart,removeCartItem,updateCartQty,clearCart} = require('../controller/cartcontroller')
const authuser = require("../middleware/authuser")
const router = express.Router();

router.post("/add",authuser,addToCart)
router.get("/get",authuser,getUserCart)
router.put("/update",authuser,updateCartQty)
router.delete("/remove/:productId",authuser,removeCartItem)
router.delete("/clear",authuser,clearCart)

module.exports = router;