const express = require('express')
const {addSubCat,getByCategory,getsubcategory,getsubcategoryByID,deletesubcategory,updatesubcategory} = require('../controller/subcategorycontroller')
const upload = require('../middleware/upload')
const authadmin = require('../middleware/authadmin')
const router = express.Router();

router.post('/addsubcategory',upload.single('subimage'),authadmin,addSubCat)
router.get('/getbycategory/:cid',getByCategory)
router.get('/getsubcategory',getsubcategory)
router.get('/getsubcategorybyid/:subid',getsubcategoryByID)
router.delete('/deletesubcategory/:subid',authadmin,deletesubcategory)
router.put('/updatesubcategory/:subid',upload.single('subimage'),authadmin,updatesubcategory)

module.exports = router