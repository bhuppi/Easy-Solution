const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;
const productModel = new mongoose.Schema(
  {
    images: [
      {
        type: { type: String, enum: ["IMAGE", "VIDEO"] },
        url: { type: String },
      },
    ],
    title: { type: String },
    subtitle: { type: String },
    price: { type: Number },
    time: { type: String },
    features: [String],
    warranty: Date,
    additional: [
      {
        type: { type: String, enum: ["IMAGE", "VIDEO"] },
        url: { type: String },
      },
    ],
    categoryId: { type: objectId, ref: "eCommerceCategoryModel" },
    pcategoryId: { type: objectId, ref: "eCommerceCategoryModel" },
    taxId:{type:objectId,ref:"taxModel"},
    mrp: { type: Number },
    thumnail: { type: String },
    disable: { type: Boolean, default: false },
    stock:{type:Number,default:0},
    sold:{ type: Number, default: 0 },
    description:String,
    brandId :{ type: objectId, ref: "eCommerceBrandModel" },
    reviewRating:{ type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("eCommerceProductModel", productModel);
