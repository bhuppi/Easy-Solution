const mongoose = require("mongoose");

const contactUsModel = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    discription: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("contactUsModel", contactUsModel);
