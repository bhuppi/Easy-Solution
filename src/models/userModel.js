const mongoose = require("mongoose");
const { userPermissions } = require("../helper/userPermission");
const { userType } = require("../helper/userType");
let objectId = mongoose.Types.ObjectId;

const userModel = new mongoose.Schema(
  {
    image: { type: String, default: null },
    fullName: String,
    phoneNumber: Number,
    email: String,
    password: String,
    userType: {
      type: [{ type: String, enum: Object.values(userType) }],
      default: [userType.customer],
    },
    permissions: {
      type: [{ type: String, enum: Object.values(userPermissions) }],
      default: [userPermissions.none],
    },
    membership: {
      membershipId: {
        type: objectId,
        default: null,
      },
      title:String,
      logo: String,
      features: [String],
      durationInMonth: Number,
      discountPercent: { type: Number },
      startDate: Date,
      endDate: Date,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  { timeStamps: true }
);
module.exports = mongoose.model("userModel", userModel);
