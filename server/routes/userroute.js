const express = require('express')
const {Adduser,Getuser,GetuserbyID,DeluserbyID,Login,Getprofile,updateprofile} = require('../controller/usercontroller')
const authuser = require('../middleware/authuser')
const authadmin = require('../middleware/authadmin')
const router = express.Router();

router.post('/adduser',Adduser)
router.post('/login',Login)
router.get('/getuser',Getuser)
router.delete('/deleteuser/:uid',authadmin,DeluserbyID)
router.get('/getprofile',authuser,Getprofile)
router.put('/updateprofile',authuser,updateprofile)

module.exports = router