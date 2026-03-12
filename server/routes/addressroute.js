const express = require("express")
const {addAddress,getAddresses,setDefaultAddress,deleteAddress} = require("../controller/addresscontroller")
const authuser = require("../middleware/authuser")
const router = express.Router();

router.post("/add",authuser,addAddress);
router.get("/get",authuser,getAddresses);
router.put("/default/:addressId",authuser,setDefaultAddress);
router.delete("/delete/:addressId",authuser,deleteAddress);

module.exports = router;
