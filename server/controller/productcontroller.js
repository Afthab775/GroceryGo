const productmodel = require('../models/productmodel')

const addproduct = async(req,res)=>{
    try {
        const{pname,pdescription,pprice,pquantity,punit,cid,subid} = req.body
        const productimage = req.file ? req.file.path : null;
        const productdata = new productmodel ({product_name:pname,product_description:pdescription,
        product_price:pprice,product_quantity:pquantity,product_unit:punit,product_image:productimage,categoryID:cid,subcategoryID:subid})
    await productdata.save();
    res.status(201).json({message:"Product Added",productdata})
    } catch (error) {
        res.status(500).json({message:"Server Error"})
        console.log(error)
    }
}

const getproducts = async(req,res)=>{
    try {
        const products = await productmodel.find().populate("categoryID","category_name")
        .populate("subcategoryID","sub_name");
        console.log("Products found",products)
        res.status(201).json({message:"Products Found",products})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error",error})

    }
}

const getproductbyID = async(req,res)=>{
    try {
        const {pid} = req.params;
        const oneproduct = await productmodel.findById(pid)
        if(!oneproduct){
            res.status(404).json({message:"Product not found",error})
        }
        res.status(201).json({message:"Product found",oneproduct})
        console.log("Product found",oneproduct)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error",error})
    }
}

const deleteproduct = async(req,res)=>{
    try {
        const {pid} = req.params;
        const deleteproduct = await productmodel.findByIdAndDelete(pid)
        res.status(201).json({message:"Product deleted",deleteproduct})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error",error})
    }
}

const updateproduct = async(req,res)=>{
    try {
        const {pid} = req.params;
        const updateData = {...req.body}
        if(req.file){
            updateData.product_image = req.file.path;
        }
        const updateproduct = await productmodel.findByIdAndUpdate(pid,updateData,{new:true});
        if(!updateproduct){
            res.status(404).json({message:"Product not found"})
        }
        res.status(201).json({message:"Product Updated",updateproduct})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error",error})
    }
}

const getBySub = async (req,res) => {
  try {
    const {subid} = req.params;
    const products = await productmodel.find({ subcategoryID: subid });
    res.status(201).json({products})
  } catch (error) {
    console.log(error)
        res.status(500).json({message:"Server Error",error})
  }
};

const getAll = async (req,res) => {
  try {
    const products = await productmodel.find().populate('categoryID').populate('subcategoryID');
    res.status(201).json({products})
  } catch (error) {
    console.log(error)
        res.status(500).json({message:"Server Error",error})
  }
};

const searchProducts = async(req,res) => {
    try {
        const { q } = req.query;

        if(!q || q.trim() ===""){
            return res.status(200).json({ products: [] });
        }

        const searchRegex = new RegExp(q, 'i');

        const products = await productmodel.find({
            $or:[
                { product_name: searchRegex },
                { product_description: searchRegex },
                { product_unit: searchRegex }
            ]
        })
        .populate('categoryID','category_name')
        .populate('subcategoryID','sub_name')
        .limit(20);

        return res.status(200).json({ message: "Products found", products, count: products.length });
    } catch (error) {
        console.log("Search error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
}

module.exports = {addproduct,getproducts,getproductbyID,deleteproduct,updateproduct,getBySub,getAll,searchProducts}