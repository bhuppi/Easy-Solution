const fs = require("fs");
const categoryModel = require("../../models/ecommerce/categoryModel");
const {
  deleteFileFromObjectStorage,
} = require("../../midellwares/multerMidellware");
// ========================== Get Id =================================== ||

exports.getCategoryId = async (req, res, next, id) => {
  try {
    let Category = await categoryModel.findById(id);
    if (!Category) {
      return res.status(404).json({
        success: false,
        message: "Category Not Found",
      });
    } else {
      (req.Category = Category), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Create Category ================================== ||

exports.createCategory = async (req, res) => {
  try {
    let { name, pCategory } = req.body;
    let arr = [];
    if (req.files) {
      req.files.banner
        ? req.files.banner.map((file) => {
            if (file.mimetype == "video/mp4") {
              let obj = {
                type: "VIDEO",
                url: file.key,
              };
              arr.push(obj);
            }
            if (
              file.mimetype == "image/jpeg" ||
              file.mimetype == "image/jpg" ||
              file.mimetype == "image/png"
            ) {
              let obj = {
                type: "IMAGE",
                url: file.key,
              };
              arr.push(obj);
            }
            // else {
            //   return res
            //     .status(400)
            //     .json({
            //       success: false,
            //       message: `this file type not valied ${file.mimetype}`,
            //     });
            // }
          })
        : null;
    }
    let icons = req.files ? req.files.icon[0].key : null;
    if (!icons) {
      return res.status(400).json({
        success: false,
        message: "Icon Is Required...",
      });
    }
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name Is Required...",
      });
    }
    let Category = await categoryModel.create({
      name: name,
      pCategory: pCategory,
      banner: arr,
      icon: icons,
    });
    return res.status(201).json({
      success: true,
      message: "Category Is Created Successfully...",
      data: Category,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Get By Id =================================== ||

exports.getByCategoryId = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Category Fatch Successfully...",
      data: req.Category,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================== Get All ============================ ||

exports.getAllCategory = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await categoryModel.countDocuments({ disable: false });
    let count = Math.ceil(length / 20);
    let Category = await categoryModel
      .find({ disable: false })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate("pCategory");
    // if (!Category.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Category Not Found",
    //   });
    // } else {
      return res.status(200).json({
        success: true,
        message: "All Category Fatch Successfully...",
        data: Category,
        page: count,
      });
    // }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== Update Category ============================ ||

exports.updateCategory = async (req, res) => {
  try {
    let { name, pCategory } = req.body;
    req.files.banner
      ? req.files.banner.map((file) => {
          if (file.mimetype == "video/mp4") {
            let obj = {
              type: "VIDEO",
              url: file.key,
            };
            req.Category.banner.push(obj);
          }
          if (file.mimetype == "image/jpeg") {
            let obj = {
              type: "IMAGE",
              url: file.key,
            };
            req.Category.banner.push(obj);
          }
        })
      : null;
    let icons = req.files ? req.files.icon[0].key : null;
    if (icons && req.Category.icon) {
      deleteFileFromObjectStorage(req.Category.icon);
    }

    let updateCategory = await categoryModel.findByIdAndUpdate(
      { _id: req.Category._id },
      {
        $set: {
          name: name,
          pCategory: pCategory,
          banner: req.Category.banner,
          icon: icons ? icons : req.Category.icon,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Category Update Successfully...",
      data: updateCategory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================== Delete Category ========================= ||

exports.deleteCategory = async (req, res) => {
  try {
    if (req.Category.icon) {
      deleteFileFromObjectStorage(req.Category.icon);
    }
    if (req.Category.banner) {
      req.Category.banner.map((o) => {
        deleteFileFromObjectStorage(o.url);
      });
    }
    let deleteCategory = await categoryModel.deleteOne({
      _id: req.Category._id,
    });
    return res.status(200).json({
      success: true,
      message: "Category Delete Successfully...",
      data: deleteCategory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================ Disable Category ======================== ||

exports.disableCategory = async (req, res) => {
  try {
    let updateCategory = await categoryModel.findByIdAndUpdate(
      { _id: req.Category._id },
      {
        $set: {
          disable: !req.Category.disable,
        },
      },
      { new: true }
    );
    if (updateCategory.disable == true) {
      return res.status(200).json({
        success: true,
        message: "Category Successfully Disable...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Category Successfully Enable...",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============ Unlink =============== ||

exports.unLinks = async (req, res) => {
  try {
    let imageIndex = req.body.imageIndex;
    if (imageIndex) {
      for (let i = imageIndex - 1; i < req.Category.banner.length; i++) {
        console.log(req.Category.banner[i].url);
        deleteFileFromObjectStorage(req.Category.banner[i].url);
        req.Category.banner.splice(i, 1);
        let category = await categoryModel.findByIdAndUpdate(
          { _id: req.Category._id },
          { $set: { banner: req.Category.banner } },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          message: "Image Is Unlink Successfully",
          data: category,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============================== Get All ============================ ||

exports.getAllCategoryByAdmin = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await categoryModel.countDocuments();
    let count = Math.ceil(length / 20);
    let Category = await categoryModel
      .find()
      .populate("pCategory")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex);
    // if (!Category.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Category Not Found",
    //   });
    // } else {
      return res.status(200).json({
        success: true,
        message: "All Category Fatch Successfully...",
        data: Category,
        page: count,
      });
    // }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================= getAllCategoryWithPcategory ====================== ||
exports.getAllCategoryWithPcategory = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await categoryModel.countDocuments({ pCategory: null });
    let count = Math.ceil(length / 20);
    const getAllCategorys = await categoryModel
      .find({ pCategory: null })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate("pCategory");
    // if (!getAllCategorys.length) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Category Not Found",
    //   });
    // }
    for (let i = 0; i < getAllCategorys.length; i++) {
      const find = await categoryModel.find({
        pCategory: getAllCategorys[i]._id,
      });
      getAllCategorys[i]._doc.subCategory = find;
    }
    return res.status(200).send({
      success: true,
      message: "Sub Category Is Fatch Successfully...",
      data: getAllCategorys,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ===================== getAllNullPcategory ========================== ||
exports.getAllNullPcategory = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await categoryModel.countDocuments({
      pCategory: null,
    });
    let count = Math.ceil(length / 20);
    const getAllCategorys = await categoryModel
      .find({ pCategory: null })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex);
    // if (!getAllCategorys.length) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Category Not Found",
    //   });
    // }
    return res.status(200).send({
      success: true,
      message: "All Null pCategory Is Fatch Successfully...",
      data: getAllCategorys,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ======================= getAllCategoryWithPcategory ====================== ||
exports.getCategoryWithPcategory = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await categoryModel.countDocuments({
      pCategory: req.params.pCategory,
    });
    let count = Math.ceil(length / 20);
    const getAllCategorys = await categoryModel
      .find({ pCategory: req.params.pCategory })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate("pCategory");
    // if (!getAllCategorys.length) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Sub Category Not Found",
    //   });
    // }
    return res.status(200).send({
      success: true,
      message: "Sub Category Is Fatch Successfully...",
      data: getAllCategorys,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
