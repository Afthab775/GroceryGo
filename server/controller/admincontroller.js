const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const adminmodel = require('../models/adminmodel')
require('dotenv').config();
const SECRET = process.env.SECRET_KEY

const addadmin = async(req,res)=>{
    try {
        const{aemail,apassword} = req.body;
        const hpass = await bcryptjs.hash(apassword,10)
        const admindata = new adminmodel({email:aemail,password:hpass})
        await admindata.save();
        res.status(201).json({message:"Admin registered",admindata})
    } catch (error) {
        res.status(500).json({message:"Server error",error})
    }
}

const Login = async(req,res)=>{
    try {
        console.log("BODY RECEIVED:", req.body);
        const{aemail,apassword} = req.body;
        const match = await adminmodel.findOne({email:aemail})
        const checkpass = await bcryptjs.compare(apassword,match.password);
        if(!checkpass){
           return res.json({success:false,message:"Invalid Credentials"})
        }
        if(!match){
            return res.json({success:false,message:"Invalid User"})
        }else{
            const Token = await jwt.sign({id: match.id},SECRET)
            console.log(Token)
            res.json({success:true,message:"Logged in successfully",Token})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Server error"})
    }
}

module.exports = {addadmin,Login}