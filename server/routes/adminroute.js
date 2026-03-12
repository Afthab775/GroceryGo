const express = require('express')
const {addadmin,Login} = require('../controller/admincontroller')
const authadmin = require('../middleware/authadmin')
const router = express.Router();

router.post('/addadmin',addadmin)
router.post('/login',Login)

module.exports = router;