const jwt = require('jsonwebtoken')
require('dotenv').config();
const SECRET = process.env.SECRET_KEY

const authuser = async(req,res,next)=>{
    try {
        const userToken = await req.header("auth-token");
        if(userToken){
            const userdata = await jwt.verify(userToken,SECRET)
            req.userID = userdata;
            next();
        }else{
            res.json({success:false,message:"Unauthorised Token"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Server Error"})
    }
}

module.exports = authuser;