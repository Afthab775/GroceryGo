const categorymodel = require('../models/categorymodel')
const SubCategoryModel = require('../models/subcategorymodel')
const productmodel = require('../models/productmodel')

const addcategory = async(req,res)=>{
    try {
        const{cname}=req.body
        const categoryimg = req.file ? req.file.filename : null
        const categorydata = new categorymodel({category_name:cname,category_image:categoryimg})
        await categorydata.save()
        res.status(201).json({message:"category created",categorydata})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error",error})
    }
}

const getcategory = async(req,res)=>{
    try {
        const categories = await categorymodel.find();
        console.log("Category details found"+categories)
        res.status(201).json({message:"All category details fetched",categories})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error",error})
    }
}

const getcategorybyID = async(req,res)=>{
    try {
        const{cid} = req.params;
        const onecategory = await categorymodel.findById(cid);
        if(!onecategory){
            return res.status(404).json({message:"category not found",error})
        }
        res.status(201).json({message:"category found",onecategory})
        console.log(onecategory)
    } catch (error) {
        res.status(500).json({message:"server error",error})
        console.log(error)
    }
}

const deletecategory = async(req,res)=>{
    try {
        const{cid}=req.params;
        await productmodel.deleteMany({categoryID:cid})
        await SubCategoryModel.deleteMany({parent_category:cid});
        const delcat = await categorymodel.findByIdAndDelete(cid)
        res.status(201).json({message:"Category Deleted",delcat})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error",error})
    }
}

const updatecategory = async(req,res)=>{
    try {
        const {cid} = req.params;
        const upCat = {...req.body};
        if(req.file){
            upCat.category_image = req.file.filename;
        }
        const updatedcategory = await categorymodel.findByIdAndUpdate(cid,upCat,{new:true});
        if(!updatedcategory){
            res.status(404).json({message:"Category not found"})
        }
        res.status(201).json({message:"Category Updated",updatedcategory})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}

module.exports = {addcategory,getcategory,getcategorybyID,deletecategory,updatecategory}