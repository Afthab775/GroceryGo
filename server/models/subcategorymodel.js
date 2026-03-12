const mongoose = require('mongoose');
const SubCategoryModel = new mongoose.Schema({
  sub_name: { type: String, required: true },
  sub_image: { type: String },
  parent_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});
module.exports = mongoose.model('SubCategory', SubCategoryModel);
