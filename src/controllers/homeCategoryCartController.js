const homeCategoryCartModel = require("../models/homeCategoryCartModel");
const {
  deleteFileFromObjectStorage,
} = require("../midellwares/multerMidellware");
// ========================== Get Id =================================== ||

exports.getHomeCategoryCartId = async (req, res, next, id) => {
  try {
    let HomeCategoryCart = await homeCategoryCartModel.findById(id);
    if (!HomeCategoryCart) {
      return res.status(404).json({
        success: false,
        message: "Home Category Not Found",
      });
    } else {
      (req.HomeCategoryCart = HomeCategoryCart), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Create App Banner ================================== ||

exports.createHomeCategoryCart = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner Is Required...",
      });
    }
    let HomeCategoryCart = await homeCategoryCartModel.create({
      image: req.file.key,
      title: req.body.title,
      subtitle: req.body.subtitle,
      backgroundColourCode: req.body.backgroundColourCode,
      taskColourCode: req.body.taskColourCode,
    });
    return res.status(201).json({
      success: true,
      message: "HomeCategory Is Created Successfully...",
      data: HomeCategoryCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Get By Id =================================== ||

exports.getByHomeCategoryCartId = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "HomeCategory Fatch Successfully...",
      data: req.HomeCategoryCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================== Get All ============================ ||

exports.getAllHomeCategoryCart = async (req, res) => {
  try {
    let HomeCategoryCart = await homeCategoryCartModel.find();
    if (!HomeCategoryCart.length) {
      return res.status(400).json({
        success: false,
        message: "HomeCategory Not Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All HomeCategoryCart Fatch Successfully...",
        data: HomeCategoryCart,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== Update HomeCategoryCart ============================ ||

exports.updateHomeCategoryCart = async (req, res) => {
  try {
    let HomeCategoryCart = req.HomeCategoryCart;
    if (req.file && req.HomeCategoryCart.image) {
      deleteFileFromObjectStorage(req.HomeCategoryCart.image);
    }
    let updateHomeCategoryCart = await homeCategoryCartModel.findByIdAndUpdate(
      { _id: HomeCategoryCart._id },
      {
        $set: {
          image: req.file ? req.file.key : req.HomeCategoryCart.image,
          title: req.body.title,
          subtitle: req.body.subtitle,
          backgroundColourCode: req.body.backgroundColourCode,
          taskColourCode: req.body.taskColourCode,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "HomeCategoryCart Update Successfully...",
      data: updateHomeCategoryCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================== Delete HomeCategoryCart ========================= ||

exports.deleteHomeCategoryCart = async (req, res) => {
  try {
    let deleteHomeCategoryCart = await homeCategoryCartModel.deleteOne({
      _id: req.HomeCategoryCart._id,
    });
    if (deleteHomeCategoryCart.image) {
      deleteFileFromObjectStorage(deleteHomeCategoryCart.banner);
    }
    return res.status(200).json({
      success: true,
      message: "HomeCategoryCart Delete Successfully...",
      data: deleteHomeCategoryCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
