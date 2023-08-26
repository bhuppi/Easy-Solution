const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;

const ecommerceCartModel = new mongoose.Schema(
  {
    customerId: { type: ObjectId, ref: "userModel" },
    productId: { type: ObjectId, ref: "eCommerceProductModel" },
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("eCommerceCartModel", ecommerceCartModel);
