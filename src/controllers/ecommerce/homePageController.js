const homeBannerModel = require("../../models/ecommerce/homeBannerModel");
const categoryModel = require("../../models/ecommerce/categoryModel");
const homeCategoryCartModel = require("../../models/ecommerce/homeCategoryCartModel");
const homeProductModel = require("../../models/ecommerce/homeProductModel");
// ======================= Home Page ======================= ||

exports.homePage = async (req, res) => {
  try {
    let homeBanner = await homeBannerModel.find();
    let category = await categoryModel
      .find({ disable: false, pCategory: null })
      .sort({ createdAt: -1 });
    let homeCategoryCart = await homeCategoryCartModel.find();
    let homeProduct = await homeProductModel
      .find()
      .populate([{ path: "products" }]);
    return res.status(200).json({
      success: true,
      message: "HomePage Fatch",
      data: {
        homeBanner: homeBanner,
        category: category,
        homeCategoryCart: homeCategoryCart,
        product: homeProduct,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
