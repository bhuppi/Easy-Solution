const mongoose = require("mongoose");

const eCommerceCategoryProductModel = new mongoose.Schema(
  {
    title: String,
    description: String,
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "eCommerceProductModel",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "E-CommerceCategoryProductModel",
  eCommerceCategoryProductModel
);
