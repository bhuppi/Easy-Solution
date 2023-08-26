const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;
const ecommerceCategoryModel = new mongoose.Schema(
  {
    name: String,
    icon: String,
    banner: [
      {
        type: { type: String, enum: ["IMAGE", "VIDEO"] },
        url: { type: String, default: null },
      },
    ],
    pCategory: { type: objectId, ref: "eCommerceCategoryModel", default: null },
    disable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "eCommerceCategoryModel",
  ecommerceCategoryModel
);
