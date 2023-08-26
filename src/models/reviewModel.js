const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;
const reviewModel = new mongoose.Schema(
  {
    userId:{type:objectId,ref:"userModel"},
    productId:{type:objectId,ref:"productModel"},
    comment:{type:String},
    rating:{type:Number,default:1},
    disable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reviewModel", reviewModel);
