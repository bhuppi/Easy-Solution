const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;
const {
  idDocumentStatus,
  idDocumentType,
} = require("../helper/idDocumentStatus");
const partnerProfileModel = new mongoose.Schema(
  {
    name: String,
    email: String,
    phoneNumber: Number,
    address: String,
    pincode: String,
    idDocument: {
      status: {
        type: String,
        enum: Object.values(idDocumentStatus),
        // default: null,
      },
      image: { type: String, default: null },
      type: {
        type: String,
        enum: Object.values(idDocumentType),
        // default: null,
      },
      profileVerificetionCompleted: { type: Boolean, default: false },
    },
    selfie: {
      image: { type: String, default: null },
      status: {
        type: String,
        enum: Object.values(idDocumentStatus),
        // default: null,
      },
    },
    latitude: String,
    longitude: String,
    cityId: { type: objectId, ref: "cityModel" },
    userId: { type: objectId, ref: "userModel" },
    disable: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("partnerProfileModel", partnerProfileModel);
