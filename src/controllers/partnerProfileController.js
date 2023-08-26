const partnerProfileModel = require("../models/partnerProfileModel");
const {
  deleteFileFromObjectStorage,
} = require("../midellwares/multerMidellware");

const {
  idDocumentStatus,
  idDocumentType,
} = require("../helper/idDocumentStatus");

// ========================== Get Id =================================== ||

exports.getPartnerProfileId = async (req, res, next, id) => {
  try {
    let partnerProfile = await partnerProfileModel
      .findById(id)
      .populate("cityId userId");
    if (!partnerProfile) {
      return res.status(404).json({
        success: false,
        message: "partnerProfile Not Found",
      });
    } else {
      (req.partnerProfile = partnerProfile), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Create partnerProfile ================================== ||

exports.createPartnerProfile = async (req, res) => {
  try {
    let {
      name,
      email,
      phoneNumber,
      address,
      pincode,
      status,
      longitude,
      latitude,
      type,
      userId,
      selfieStatus,
      cityId,
    } = req.body;
    let selfie;
    let image;
    if (req.files && req.files.selfie) {
      selfie = req.files.selfie ? req.files.selfie[0].key : null;
    }
    if (req.files && req.files.image) {
      image = req.files.image ? req.files.image[0].key : null;
    }
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name Is Required...",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email Is Required...",
      });
    }
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "phoneNumber Is Required...",
      });
    }
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "address Is Required...",
      });
    }
    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: "pincode Is Required...",
      });
    }
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId Is Required...",
      });
    }
    let obj = {};
    obj.status = image ? "PENDING" : status;
    obj.image = image;
    obj.type = type;
    let obj2 = {};
    obj2.image = selfie;
    obj2.status = selfie ? "PENDING" : selfieStatus;

    let partnerProfile = await partnerProfileModel.create({
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      pincode: pincode,
      status: status,
      type: type,
      userId: userId,
      longitude: longitude,
      latitude: latitude,
      cityId: cityId,
      selfie: selfie,
      idDocument: obj,
    });
    return res.status(201).json({
      success: true,
      message: "partnerProfile Is Created Successfully...",
      data: partnerProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Get By Id =================================== ||

exports.getBypartnerProfileId = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "partnerProfile Fatch Successfully...",
      data: req.partnerProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================== Get All ============================ ||

exports.getAllpartnerProfile = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let partnerProfile = await partnerProfileModel
      .find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate("cityId userId");
      let length = await partnerProfileModel.countDocuments();
      let count = Math.ceil(length / 20);
    // if (!partnerProfile.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "partnerProfile Not Found",
    //   });
    // } else {
      return res.status(200).json({
        success: true,
        message: "All partnerProfile Fatch Successfully...",
        data: partnerProfile,
        page: count
      });
    // }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== Update partnerProfile ============================ ||

exports.updatePartnerProfile = async (req, res) => {
  try {
    let partnerProfile = req.partnerProfile;
    let {
      name,
      email,
      phoneNumber,
      address,
      pincode,
      status,
      longitude,
      latitude,
      type,
      userId,
      selfieStatus,
      cityId,
    } = req.body;
    let selfie;
    let image;
    if (req.files && req.files.selfie) {
      selfie = req.files.selfie ? req.files.selfie[0].key : null;
    }
    if (req.files && req.files.image) {
      image = req.files.image ? req.files.image[0].key : null;
    }
    if (selfie && partnerProfile.selfie != null) {
      deleteFileFromObjectStorage(partnerProfile.selfie);
    }
    if (image && partnerProfile.document.image != null) {
      deleteFileFromObjectStorage(partnerProfile.document.image);
    }
    let obj = {};
    obj.status = image ? "PENDING" : status;
    obj.image = image;
    obj.type = type;
    let obj2 = {};
    obj2.image = selfie;
    obj2.status = selfie ? "PENDING" : selfieStatus;

    let updatepartnerProfile = await partnerProfileModel.findByIdAndUpdate(
      { _id: partnerProfile._id },
      {
        $set: {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
          pincode: pincode,
          status: status,
          type: type,
          userId: userId,
          latitude: latitude,
          longitude: longitude,
          cityId: cityId,
          selfie: obj2,
          idDocument: obj,
        },
      },
      { new: true }
    ).populate("cityId userId");
    return res.status(200).json({
      success: true,
      message: "partnerProfile Update Successfully...",
      data: updatepartnerProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================== Delete partnerProfile ========================= ||

exports.deletepartnerProfile = async (req, res) => {
  try {
    let deletepartnerProfile = await partnerProfileModel.deleteOne({
      _id: req.partnerProfile._id,
    });
    return res.status(200).json({
      success: true,
      message: "partnerProfile Delete Successfully...",
      data: deletepartnerProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================ Disable partnerProfile ======================== ||

exports.disablepartnerProfile = async (req, res) => {
  try {
    let updatepartnerProfile = await partnerProfileModel.findByIdAndUpdate(
      { _id: req.partnerProfile._id },
      {
        $set: {
          disable: !req.partnerProfile.disable,
        },
      },
      { new: true }
    );
    if (updatepartnerProfile.disable == true) {
      return res.status(200).json({
        success: true,
        message: "partnerProfile Successfully Disable...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "partnerProfile Successfully Enable...",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== updateSelfiePartnerProfile ========================= ||

exports.updateSelfiePartnerProfile = async (req, res) => {
  try {
    let partnerProfile = req.partnerProfile;
    let selfie;
    if (req.file) {
      selfie = req.file ? req.file.key : null;
    }
    if (selfie != null && partnerProfile.selfie.image != null) {
      deleteFileFromObjectStorage(partnerProfile.selfie.image);
    }
    if (!selfie) {
      return res.status(400).json({
        success: false,
        message: "selfie Is Required...",
      });
    }
    let obj2 = {};
    obj2.image = selfie;
    obj2.status = selfie ? "PENDING" : selfieStatus;
    let updatepartnerProfile = await partnerProfileModel.findByIdAndUpdate(
      { _id: partnerProfile._id },
      {
        $set: {
          selfie: obj2,
        },
      },
      { new: true }
    ).populate("cityId userId");
    return res.status(200).json({
      success: true,
      message: "partnerProfile Selfie Update Successfully...",
      data: updatepartnerProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== updateDocumentPartnerProfile ========================= ||

exports.updateDocumentPartnerProfile = async (req, res) => {
  try {
    let partnerProfile = req.partnerProfile;
    let image;
    let obj = {};
    if (req.file) {
      image = req.file ? req.file.key : null;
    }
    if (image != null && partnerProfile.image != null) {
      deleteFileFromObjectStorage(partnerProfile.image);
    }
    if (
      !image ||
      !req.body.type ||
      (req.body.type && !Object.values(idDocumentType).includes(req.body.type))
    ) {
      throw {
        status: 400,
        message: !image
          ? "Image IS Required.."
          : !req.body.type
          ? "Type Is Required..."
          : "Please Provide Valied Type (DRAVING_LICENCE , VOTER_ID_CARD , ADDHAR_CARD)",
      };
    }
    obj.status = image ? "PENDING" : req.body.status;
    obj.image = image;
    obj.type = req.body.type;
    let updatepartnerProfile = await partnerProfileModel.findByIdAndUpdate(
      { _id: partnerProfile._id },
      {
        $set: {
          idDocument: obj,
        },
      },
      { new: true }
    ).populate("cityId userId");
    return res.status(200).json({
      success: true,
      message: "partnerProfile Document Update Successfully...",
      data: updatepartnerProfile,
    });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};

// ====================== updateDocumentPartnerProfile ========================= ||

exports.updateDocumentStatus = async (req, res) => {
  try {
    let partnerProfile = req.partnerProfile;
    if (
      (req.body.status &&
        !Object.values(idDocumentStatus).includes(req.body.status)) ||
      (req.body.selfieStatus &&
        !Object.values(idDocumentStatus).includes(req.body.selfieStatus))
    ) {
      throw {
        status: 400,
        message: "Please Provide Valied Status (REJECTED PENDING APPROVED)",
      };
    }
    const updatepartnerProfile = await partnerProfileModel.findByIdAndUpdate(
      { _id: partnerProfile._id },
      {
        $set: {
          "idDocument.status": req.body.status,
          "selfie.status": req.body.selfieStatus,
        },
      },
      { new: true }
    ).populate("cityId userId");
    return res.status(200).json({
      success: true,
      message: "partnerProfile Document Update Successfully...",
      data: updatepartnerProfile,
    });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};
