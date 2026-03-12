const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const usermodel = require('../models/usermodel')
require('dotenv').config();
const SECRET = process.env.SECRET_KEY
const user = require('../models/usermodel')

const Adduser = async (req,res)=>{
    try {
        const{uname,uphone,uemail,upassword} = req.body
        const hpass = await bcryptjs.hash(upassword,10)
        const userdata = new usermodel({name:uname,phone:uphone,email:uemail,password:hpass})
        await userdata.save()
        res.status(201).json({message:"user created",userdata})
    } catch (error) {
        res.status(500).json({message:"Server error",error})
    }
}

const Getuser = async(req,res)=>{
    try {
        const getusers = await usermodel.find();
        console.log("User details found"+getusers)
        res.status(201).json({message:"all user details fetched",getusers})
    } catch (error) {
        res.status(500).json({message:"server error",error})
        console.log(error)
    }
}

const GetuserbyID = async(req,res)=>{
    try {
        const {uid} = req.params;
        const oneuser = await usermodel.findById(uid);
        if(!oneuser){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({message:"User found",oneuser})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error",error})
    }
}

const DeluserbyID = async(req,res)=>{
    try {
        const{uid} = req.params;
        const deluser = await usermodel.findByIdAndDelete(uid);
        res.status(200).json({message:"User deleted",deluser})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error",error})
    }
}

const Login = async(req,res)=>{
    try {
        console.log("BODY RECEIVED:", req.body);
        const{uemail,upassword} = req.body;
        const match = await usermodel.findOne({email:uemail})
        const checkpass = await bcryptjs.compare(upassword,match.password);
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

const Getprofile = async(req,res)=>{
    try {
        const iduser = req.userID.id;
        const userp = await usermodel.findById(iduser)
        if(!user){
            res.status(404).json({message:"User not found"})
        }else{
            res.status(200).json({message:"User found",userp})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error",error})
    }
}

const updateprofile = async(req,res)=>{
    try {
        const iduser = req.userID.id;
        const userp = await usermodel.findByIdAndUpdate(iduser)
        if(!user){
            res.status(404).json({message:"User not found"})
        }
        const updateform = ({name:req.body.uname,
            phone:req.body.uphone,
            email:req.body.uemail
        })
        const updateprofile = await user.findByIdAndUpdate(iduser,updateform,({new:true}))
        res.status(200).json({message:"User Profile updated successfully",user:updateprofile})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error"})     
    }
}

module.exports = {Adduser,Getuser,GetuserbyID,DeluserbyID,Login,Getprofile,updateprofile};