const couponModel = require("../models/couponModel");
const {
  deleteFileFromObjectStorage,
} = require("../midellwares/multerMidellware");

function calculateEndDate(startDate, validity) {
  const parsedStartDate = new Date(startDate);
  const endDate = new Date(
    parsedStartDate.getTime() + validity * 24 * 60 * 60 * 1000
  );
  return endDate.toISOString();
}

// ========================== Get Id =================================== ||

exports.getCouponId = async (req, res, next, id) => {
  try {
    let Coupon = await couponModel.findById(id).populate("categoryId");
    if (!Coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon Not Found",
      });
    } else {
      (req.Coupon = Coupon), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================= Create Coupon ============================== ||

exports.creatCoupon = async (req, res) => {
  try {
    const {
      couponName,
      couponCode,
      couponPercent,
      categoryId,
      minOrderPrice,
      maxDiscountPrice,
      couponQuantity,
      validity,
      disable,
      backgroundColourCode,
    taskColourCode
    } = req.body;
    let endDate;
    let startDate;
    if (validity) {
      startDate = new Date();
      endDate = calculateEndDate(startDate, validity);
    }
    let icon = req.file ? req.file.key : null;
    if (!icon) {
      return res
        .status(400)
        .json({ success: false, message: "icon Is Required..." });
    }
    if (!couponName) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon Name Is Required..." });
    }
    if (!couponCode) {
      return res
        .status(400)
        .json({ success: false, message: "couponCode Is Required..." });
    }
    if (!couponPercent) {
      return res
        .status(400)
        .json({ success: false, message: "couponPercent Is Required..." });
    }
    if (!minOrderPrice) {
      return res
        .status(400)
        .json({ success: false, message: "minOrderPrice Is Required..." });
    }
    if (!maxDiscountPrice) {
      return res
        .status(400)
        .json({ success: false, message: "maxDiscountPrice Is Required..." });
    }
    if (!couponQuantity) {
      return res
        .status(400)
        .json({ success: false, message: "couponQuantity Is Required..." });
    }
    if (!validity) {
      return res
        .status(400)
        .json({ success: false, message: "validity Is Required..." });
    }
    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "categoryId Is Required..." });
    }
    if(!backgroundColourCode){
      return res
        .status(400)
        .json({ success: false, message: "backgroundColourCode Is Required..." });
    }
    if(!taskColourCode){ 
      return res
        .status(400)
        .json({ success: false, message: "taskColourCode Is Required..." });
    }
    const findCounpon = await couponModel.find();
    for (let i = 0; i < findCounpon.length; i++) {
      if (findCounpon[i].couponCode === couponCode) {
        return res.status(400).json({
          success: false,
          message: "Please Provide Unique CouponCode",
        });
      }
    }
    const Coupon = await couponModel.create({
      couponName: couponName,
      couponCode: couponCode,
      couponPercent: couponPercent,
      categoryId: categoryId,
      minOrderPrice: minOrderPrice,
      maxDiscountPrice: maxDiscountPrice,
      couponQuantity: couponQuantity,
      validity: validity,
      icon: icon,
      expiryDate: endDate,
      startDate: startDate,
      disable: disable,
      backgroundColourCode:backgroundColourCode,
      taskColourCode:taskColourCode
    });
    return res.status(201).json({
      success: true,
      message: "Coupon Is Create Successfully...",
      data: Coupon,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ====================== Get Coupon By Id =========================== ||

exports.getCouponById = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Coupon Is Fatch Successfully...",
      data: req.Coupon,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ====================== Get All Coupon =========================== ||

exports.getAllCoupon = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await couponModel.countDocuments({ disable: false });
    let count = Math.ceil(length / 20);
    const Coupon = await couponModel
      .find({ disable: false })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate("categoryId");
    // if (!Coupon.length) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Coupon Not Found" });
    // }
    return res.status(200).json({
      success: true,
      message: "Coupon Is Fatch Successfully...",
      data: Coupon,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ====================== Update Coupon =========================== ||

exports.updateCoupon = async (req, res) => {
  try {
    const {
      couponName,
      couponCode,
      couponPercent,
      categoryId,
      minOrderPrice,
      maxDiscountPrice,
      couponQuantity,
      validity,
      disable,
      taskColourCode,
      backgroundColourCode

    } = req.body;
    let startDate;
    let endDate;
    let icon = req.file ? req.file.key : null;
    if (validity) {
      startDate = new Date(req.Coupon.startDate);
      endDate = calculateEndDate(startDate, validity);
    }
    if (req.Coupon.icon && icon) {
      deleteFileFromObjectStorage(req.Coupon.icon);
    }
    const findCounpon = await couponModel.find();
    for (let i = 0; i < findCounpon.length; i++) {
      if (findCounpon[i].couponCode === couponCode) {
        if(findCounpon[i]._id != req.Coupon._id.toString()){
          return res.status(400).json({
            success: false,
            message: "Please Provide Unique CouponCode",
          });
        }
      }
    }
    const updateCoupon = await couponModel
      .findOneAndUpdate(
        { _id: req.Coupon._id },
        {
          $set: {
            couponName: couponName,
            couponCode: couponCode,
            couponPercent: couponPercent,
            categoryId: categoryId,
            minOrderPrice: minOrderPrice,
            maxDiscountPrice: maxDiscountPrice,
            couponQuantity: couponQuantity,
            validity: validity,
            disable: disable,
            backgroundColourCode:backgroundColourCode,
            taskColourCode:taskColourCode,
            startDate: startDate,
            expiryDate: endDate,
          },
        },
        { new: true }
      )
      .populate("categoryId");
    return res.status(200).json({
      success: true,
      message: "Coupon Is Update Successfully...",
      data: updateCoupon,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ====================== disable Coupon ======================== ||

exports.disableCoupon = async (req, res) => {
  try {
    let disableCoupon = await couponModel.findOneAndUpdate(
      { _id: req.Coupon._id },
      { $set: { disable: !req.Coupon.disable } },
      { new: true }
    );
    if (disableCoupon.disable) {
      return res
        .status(200)
        .send({ success: true, message: "Coupon Is Successfully disabled" });
    } else {
      return res
        .status(200)
        .send({ success: true, message: "Coupon Is Successfully enable" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getAllCouponByAdmin = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await couponModel.countDocuments();
    let count = Math.ceil(length / 20);
    const Coupon = await couponModel
      .find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate("categoryId");
    return res.status(200).json({
      success: true,
      message: "Coupon Is Fatch Successfully...",
      data: Coupon,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
