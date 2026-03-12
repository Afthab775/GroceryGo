const express = require("express")
const {createOrder,getMyOrders,getOrderById,getOrderByIdAdmin,getAllOrders,updateOrderStatus,cancelOrder} = require("../controller/ordercontroller")
const authuser = require("../middleware/authuser")
const authadmin = require("../middleware/authadmin")
const router = express.Router();

router.post("/create",authuser,createOrder);
router.get("/my",authuser,getMyOrders);
router.get("/orders",authadmin,getAllOrders);
router.get("/admin/:id",authadmin,getOrderByIdAdmin);
router.get("/:id",authuser,getOrderById);
router.put("/updatestatus/:id",authadmin,updateOrderStatus);
router.put("/cancel/:id",authuser,cancelOrder)

module.exports = router;