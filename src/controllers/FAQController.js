const FAQModel = require("../models/FAQModel");

// ========================== Get Id =================================== ||

exports.getFAQId = async (req, res, next, id) => {
  try {
    let FAQ = await FAQModel.findById(id);
    if (!FAQ) {
      return res.status(404).json({
        success: false,
        message: "FAQ Not Found",
      });
    } else {
      (req.FAQ = FAQ), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Create FAQ ================================== ||

exports.createFAQ = async (req, res) => {
  try {
    let { question, answer } = req.body;
    if (!question || !answer) {
      throw {
        status: 400,
        message: !question
          ? "question is Required..."
          : "answer is Required...",
      };
    }
    let FAQ = await FAQModel.create({
      question: question,
      answer: answer,
    });
    return res.status(201).json({
      success: true,
      message: "FAQ Is Created Successfully...",
      data: FAQ,
    });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};

// ========================== Get By Id =================================== ||

exports.getByFAQId = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "FAQ Fatch Successfully...",
      data: req.FAQ,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================== Get All ============================ ||

exports.getAllFAQ = async (req, res) => {
  try {
    let FAQ = await FAQModel.find();
    if (!FAQ.length) {
      return res.status(400).json({
        success: false,
        message: "FAQ Not Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All FAQ Fatch Successfully...",
        data: FAQ,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== Update FAQ ============================ ||

exports.updateFAQ = async (req, res) => {
  try {
    let FAQ = req.FAQ;
    let { question, answer } = req.body;
    let updateFAQ = await FAQModel.findByIdAndUpdate(
      { _id: FAQ._id },
      {
        $set: {
          question: question,
          answer: answer,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "FAQ Update Successfully...",
      data: updateFAQ,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================== Delete FAQ ========================= ||

exports.deleteFAQ = async (req, res) => {
  try {
    let deleteFAQ = await FAQModel.deleteOne({
      _id: req.FAQ._id,
    });
    return res.status(200).json({
      success: true,
      message: "FAQ Delete Successfully...",
      data: deleteFAQ,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
