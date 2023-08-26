const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;
const categoryModel = new mongoose.Schema(
  {
    name: String,
    icon: String,
    banner: [
      {
        type: { type: String, enum: ["IMAGE", "VIDEO"] },
        url: { type: String, default: null },
      },
    ],
    cityId: [{ type: objectId, ref: "cityModel" }],
    pCategory: { type: objectId, ref: "categoryModel", default: null },
    disable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("categoryModel", categoryModel);
