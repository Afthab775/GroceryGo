const multer = require('multer')
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {

        let folder = "grocery/others";

        if(file.fieldname === "cimage") {
            folder = "grocery/categories";
        }

        if(file.fieldname === "subimage") {
            folder = "grocery/subcategories";
        }

        if(file.fieldname === "pimage") {
            folder = "grocery/products";
        }

        return{
            folder: folder,
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
            resource_type: "image"
        };
    }
})
const upload = multer({storage})

module.exports = upload;
