const SubCategoryModel = require('../models/subcategorymodel')
const productmodel = require('../models/productmodel')

const addSubCat = async(req,res)=>{
    try {
        const{subname,cid} = req.body
            const subimage = req.file ? req.file.path : null;
            const subdata = new SubCategoryModel ({sub_name:subname,sub_image:subimage,parent_category:cid})
            await subdata.save();
            res.status(201).json({message:"Sub Category Added",subdata})
    } catch (error) {
        res.status(500).json({message:"Server Error"})
        console.log(error)
    }
}

const getByCategory = async (req,res) => {
  try {
    const {cid} = req.params;
    const subcats = await SubCategoryModel.find({parent_category:cid});
    res.status(201).json({subcats})
  } catch (error) {
    
  }
};

const getsubcategory = async(req,res)=>{
    try {
        const subcategories = await SubCategoryModel.find();
        console.log("Sub Category details found"+subcategories)
        res.status(201).json({message:"All sub category details fetched",subcategories})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error",error})
    }
}

const getsubcategoryByID = async(req,res)=>{
    try {
        const{subid} = req.params;
         const subcategory = await SubCategoryModel.findById(subid);
        if(!subcategory){
            return res.status(404).json({message:"sub category not found",error})
        }
    res.status(201).json({message:"sub category found",subcategory})
    console.log(subcategory)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error",error})
    }
}

const deletesubcategory = async(req,res)=>{
    try {
        const{subid}=req.params;
        await productmodel.deleteMany({subcategoryID:subid})
        const delsubcat = await SubCategoryModel.findByIdAndDelete(subid)
        res.status(201).json({message:"Sub Category Deleted",delsubcat})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error",error})
    }
}

const updatesubcategory = async(req,res)=>{
    try {
        const {subid} = req.params;
        const upSubCat = {...req.body};
        if(req.file){
            upSubCat.sub_image = req.file.path;
        }
        const updatedsubcategory = await SubCategoryModel.findByIdAndUpdate(subid,upSubCat,{new:true});
        if(!updatedsubcategory){
            res.status(404).json({message:"Sub Category not found"})
        }
        res.status(201).json({message:"Sub Category Updated",updatedsubcategory})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}

module.exports = {addSubCat,getByCategory,getsubcategory,getsubcategoryByID,deletesubcategory,updatesubcategory}