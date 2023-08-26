const reviewModel = require("../models/reviewModel");
const productModel = require("../models/productModel");

// ==================== Get Id ==================== ||

exports.getReviewId = async (req, res, next, id) => {
  let review = await reviewModel.findById(id).populate("userId productId");
  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review Not Found",
    });
  } else {
    (req.Review = review), next();
  }
};

// ==================  create Review ===================== ||

exports.createReview = async (req, res) => {
  let { userId, productId, comment, rating, disable } = req.body;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId Is Required...",
    });
  }
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "productId Is Required...",
    });
  }
  if (!comment) {
    return res.status(400).json({
      success: false,
      message: "comment Is Required...",
    });
  }
  if (!rating) {
    return res.status(400).json({ 
      success: false,
      message: "rating Is Required...",
    });
  }
  let review = await reviewModel.create({
    userId: userId,
    productId: productId,
    comment: comment,
    rating: rating,
    disable: disable,
  });
  let total = 0;
  let reviews = await reviewModel.find({ productId: productId });
  for (let i = 0; i < reviews.length; i++) {
    total += reviews[i].rating;
  }
  let ratings = total / reviews.length;
  await productModel.findByIdAndUpdate(
    { _id: productId },
    { $set: { reviewRating: ratings.toFixed(1) } },{new:true}
  );
  return res.status(201).json({
    success: true,
    message: "Review Is Created Successfully...",
    data: review,
  });
};

// ================== Get Review By Id ======================= ||

exports.getReviewById = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Review Is Fatch Successfully..",
    data: req.Review,
  });
};

// =================== Get All Review ================== ||

exports.getAllReview = async (req, res) => {
  let review = await reviewModel.find().populate("userId productId");
  if (!review.length) {
    return res.status(404).json({
      success: false,
      message: "Review Not Found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Review Is Fatch Successfully...",
    data: review,
  });
};

// ======================== update Review ======================== ||

exports.updateReview = async (req, res) => {
  let { userId, productId, comment, rating, disable } = req.body;
  let review = await reviewModel.findByIdAndUpdate(
    { _id: req.Review._id },
    {
      $set: {
        userId: userId,
        productId: productId,
        comment: comment,
        rating: rating,
        disable: disable,
      },
    },
    { new: true }
  );
  let total = 0;
  let reviews = await reviewModel.find({ productId: review.productId });
  for (let i = 0; i < reviews.length; i++) {
    total += reviews[i].rating;
  }
  let ratings = total / reviews.length;
  await productModel.findByIdAndUpdate(
    { _id: review.productId },
    { $set: { reviewRating: ratings.toFixed(1) } },{new:true}
  );
  return res.status(200).json({
    success: true,
    message: "Review Is Update Successfully...",
    data: review,
  });
};

// ======================== delete Review ====================== ||

exports.deleteReview = async (req, res) => {
  let review = await reviewModel.deleteOne({ _id: req.Review._id });
  return res.status(200).json({
    success: true,
    message: "Review Is Delete Successfully...",
    data: review,
  });
};

// ========================== disable Review ===================== ||

exports.disableReview = async (req, res) => {
  let review = await reviewModel.findByIdAndUpdate(
    { _id: req.Review._id },
    { $set: { disable: !req.Review.disable } },
    { new: true }
  );
  if (review.disable == true) {
    return res.status(200).json({
      success: true,
      message: "Review Is disable Successfully...",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Review Is Enable Successfully...",
  });
};
