const express = require('express')
const{addproduct,getproducts,getproductbyID,deleteproduct,updateproduct,getBySub,getAll,searchProducts} = require('../controller/productcontroller')
const router  = express.Router();
const upload = require('../middleware/upload')
const authadmin = require('../middleware/authadmin')

router.post('/addproduct',upload.single('pimage'),authadmin,addproduct)
router.get('/getproduct',getproducts)
router.get('/getproductbyid/:pid',getproductbyID)
router.delete('/deleteproduct/:pid',authadmin,deleteproduct)
router.put('/updateproduct/:pid',upload.single('pimage'),authadmin,updateproduct)
router.get('/getbysub/:subid',getBySub)
router.get('/getall',getAll)
router.get('/search',searchProducts)

module.exports = router