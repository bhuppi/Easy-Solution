const mongoose = require("mongoose");

const homeCatergoryCartModel = mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    backgroundColourCode: String,
    taskColourCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "homeCatergoryCartModel",
  homeCatergoryCartModel
);
