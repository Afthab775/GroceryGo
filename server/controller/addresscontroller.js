const Address = require("../models/addressmodel");

const addAddress = async(req,res)=>{
    try {
        const userId = req.userID.id;
        const{type,building,floor,landmark,name,phone} = req.body
        if(!building || !landmark || !name || !phone){
            return res.status(400).json({ msg: "Required fields missing" });
        }
        //Check if first address → make default
        const existing = await Address.findOne({ user: userId})
        const address = await Address.create({
            user: userId, type, building, floor, landmark, name, phone, isDefault: !existing, // first address becomes default
        })
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

const getAddresses = async(req,res)=>{
    try {
        const addresses = await Address.find({user: req.userID.id}).sort({createdAt:-1});
        res.status(200).json({message:"Address Found",addresses})
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

const setDefaultAddress = async(req,res)=>{
    try {
        const {addressId} = req.params;
        const userId = req.userID.id;
        //remove previous default
        await Address.updateMany({user: userId},{isDefault:false});
        //set new default
        await Address.findOneAndUpdate({_id:addressId, user:userId},{isDefault:true});
        res.json({ msg: "Default address updated" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

const deleteAddress = async(req,res)=>{
    try {
        const {addressId} = req.params;
        const userId = req.userID.id;
        const address = await Address.findOne({_id:addressId,user:userId});
        if(!address){
            return res.status(404).json({ msg: "Address not found" });
        }
        if(address.isDefault){
            return res.status(400).json({ msg: "Cannot delete default address" });
        }
        await address.deleteOne();
        res.json({ msg: "Address deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

module.exports = {addAddress,getAddresses,setDefaultAddress,deleteAddress}