const brandModel = require("../../models/ecommerce/brandModel");
const {
  deleteFileFromObjectStorage,
} = require("../../midellwares/multerMidellware");
// ========================== Get Id =================================== ||

exports.getbrandId = async (req, res, next, id) => {
  try {
    let brand = await brandModel.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "brand Not Found",
      });
    } else {
      (req.brand = brand), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Create brand ================================== ||

exports.createBrand = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "name Is Required...",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "image Is Required...",
      });
    }
    let brand = await brandModel.create({
      name: req.body.name,
      image: req.file.key,
    });
    return res.status(201).json({
      success: true,
      message: "brand Is Created Successfully...",
      data: brand,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Get By Id =================================== ||

exports.getByBrandId = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "brand Fatch Successfully...",
      data: req.brand,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================== Get All ============================ ||

exports.getAllBrand = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await brandModel.countDocuments({ disable: false });
    let count = Math.ceil(length / 20);
    let brand = await brandModel
      .find({ disable: false })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex);
    // if (!brand.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "brand Not Found",
    //   });
    // } else {
    return res.status(200).json({
      success: true,
      message: "All brand Fatch Successfully...",
      data: brand,
      page: count,
    });
    // }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== Update brand ============================ ||

exports.updatebrand = async (req, res) => {
  try {
    let brand = req.brand;
    if (req.file) {
      deleteFileFromObjectStorage(brand.image);
    }
    let updatebrand = await brandModel.findByIdAndUpdate(
      { _id: brand._id },
      {
        $set: {
          name: req.body.name,
          image: req.file ? req.file.key : brand.image,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "brand Update Successfully...",
      data: updatebrand,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================== Delete brand ========================= ||

exports.deleteBrand = async (req, res) => {
  try {
    console.log(req.brand._id);
    let deletebrand = await brandModel.deleteOne({
      _id: req.brand._id,
    });
    return res.status(200).json({
      success: true,
      message: "brand Delete Successfully...",
      data: deletebrand,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================ Disable brand ======================== ||

exports.disablebrand = async (req, res) => {
  try {
    let updatebrand = await brandModel.findByIdAndUpdate(
      { _id: req.brand._id },
      {
        $set: {
          disable: !req.brand.disable,
        },
      },
      { new: true }
    );
    if (updatebrand.disable == true) {
      return res.status(200).json({
        success: true,
        message: "brand Successfully Disable...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "brand Successfully Enable...",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================== Get All ============================ ||

exports.getAllBrandByAdmin = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await brandModel.countDocuments();
    let count = Math.ceil(length / 20);
    let brand = await brandModel
      .find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex);
    // if (!brand.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "brand Not Found",
    //   });
    // } else {
    return res.status(200).json({
      success: true,
      message: "All brand Fatch Successfully...",
      data: brand,
      page: count,
    });
    // }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
