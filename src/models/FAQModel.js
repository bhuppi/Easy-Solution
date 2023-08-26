const mongoose = require("mongoose");

const FAQModel = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQModel", FAQModel);
