const mongoose = require("mongoose");

const eCommerceHomeCatergoryCartModel = mongoose.Schema(
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
  "E-CommerceHomeCatergoryCartModel",
  eCommerceHomeCatergoryCartModel
);
