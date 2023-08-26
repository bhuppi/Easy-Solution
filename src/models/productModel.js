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
    description:String,
    price: { type: Number },
    time: { type: String },
    include: [String],
    exclude: [String],
    warranty: Date,
    rateCard: { type: objectId, ref: "" },
    additional: [
      {
        type: { type: String, enum: ["IMAGE", "VIDEO"] },
        url: { type: String },
      },
    ],
    taxId :{ type: objectId, ref: "taxModel" },
    categoryId: { type: objectId, ref: "categoryModel" },
    pcategoryId: { type: objectId, ref: "categoryModel" },
    cityId: { type: objectId, ref: "cityModel" },
    subtitle: { type: String },
    mrp: { type: Number },
    thumnail: { type: String },
    disable: { type: Boolean, default: false },
    reviewRating:{ type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("productModel", productModel);
