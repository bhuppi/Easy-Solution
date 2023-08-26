const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;

const orderModel = new mongoose.Schema(
  {
    customerId: { type: objectId, ref: "userModel" },
    product: [
      {
        productId: { type: objectId, ref: "productModel" },
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    partnerId: { type: objectId, ref: "userModel" },
    cityId: { type: objectId, ref: "cityModel" },
    orderTotal: Number,
    tax: Number,
    couponeCode: Number,
    couponeDiscount: Number,
    address: {
    },
    time: String,
    date: String,
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
        "ACCEPTED",
        "ONTHEWAY",
        "WORKING",
        "COMPLETED",
        "CANCELLED",
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
    workingOtp: Number,
    completedOtp: Number,
    reason: String,
    cancleBy: {
      type: String,
      enum: [
        "COSTOMER",
        "PATNER",
        "ADMIN",
        "SUPER_ADMIN",
        "SUB_ADMIN",
      ],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("orderModel", orderModel);
