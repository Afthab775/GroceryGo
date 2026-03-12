const jwt = require('jsonwebtoken')
require('dotenv').config();
const SECRET = process.env.SECRET_KEY

const authadmin = async(req,res,next)=>{
    try {
        const adminToken = await req.header("admin-token");
        if(adminToken){
            const admindata = await jwt.verify(adminToken,SECRET)
            req.adminID = admindata;
            next();
        }else{
            res.status(401).json({success:false,message:"Unauthorised Token"})
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({success:false,message:"Server Error"})
    }
}

module.exports = authadmin;