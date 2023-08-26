const mongoose = require("mongoose");

const eCommerceHomeBannerModel = new mongoose.Schema(
  {
    title: String,
    banner: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("E-CommerceHomeBannerModel", eCommerceHomeBannerModel);
