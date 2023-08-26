const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;

const orderModel = new mongoose.Schema(
  {
    customerId: { type: objectId, ref: "userModel" },
    product: [
      {
        productId: { type: objectId, ref: "eCommerceProductModel" },
        price: Number,
        quantity: Number,
        status: {
          type: String,
          enum: [
            "PENDING",
            "ORDERED",
            "OUT_OF_DELIVERY",
            "DELIVERED",
            "RETURN_REQUEST",
            "RETURNED",
            "RETURN_REQUEST_APPROVED",
            "CANCELLED",
            "SHIPPED",
          ],
          default: "PENDING",
        },
      },
    ],
    orderTotal: Number,
    tax: Number,
    couponeCode: Number,
    couponeDiscount: Number,
    addressId: { type: objectId, ref: "addressmodel" },
    totalOfferDiscount: Number,
    transactionId: String,
    transactionRef: String,
    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
    },
    paymentStatus: Boolean,
    status: {
      type: String,
      enum: [
        "PENDING",
        "ORDERED",
        "OUT_OF_DELIVERY",
        "DELIVERED",
        "RETURN_REQUEST",
        "RETURNED",
        "RETURN_REQUEST_APPROVED",
        "CANCELLED",
        "SHIPPED",
        "MULTI_STATUS",
      ],
      default: "PENDING",
    },
    netAmount: Number,
    memberShipId: {
      type: objectId,
      ref: "membershipModel",
      default: null,
    },
    memberDiscount: Number,
    memberDiscountPercent: Number,
    invoice: String,
    reason: String,
    cancleBy: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("e-commorderModel", orderModel);
