const express = require('express')
const {addcategory,getcategory,getcategorybyID,deletecategory,updatecategory} = require('../controller/categorycontroller')
const upload = require('../middleware/upload')
const authadmin = require('../middleware/authadmin')
const router = express.Router();

router.post('/addcategory',upload.single('cimage'),authadmin,addcategory)
router.get('/getcategory',getcategory)
router.get('/getcategorybyid/:cid',getcategorybyID)
router.delete('/deletecategory/:cid',authadmin,deletecategory)
router.put('/updatecategory/:cid',upload.single('cimage'),authadmin,updatecategory)

module.exports = router