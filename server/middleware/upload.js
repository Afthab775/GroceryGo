const multer = require('multer')
const storage = multer.diskStorage({
    destination:function(req,file,cb){ //this is a folder where files will be saved
        cb(null,'uploads/')
    },
    filename:function(req,file,cb){ //generate a unique name of date time and some random numbers
        const uniquename = Date.now()+'-'+Math.round(Math.random()*1E9)
        cb(null,file.fieldname+'-'+uniquename)
    }
})
const upload = multer({storage:storage})
module.exports = upload
//set the destination folder where files should be stored