const mongoose = require("mongoose");

const ecommerceBrandModel = new mongoose.Schema(
  {
    name: String,
    image: String,
    disable: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("eCommerceBrandModel", ecommerceBrandModel);
