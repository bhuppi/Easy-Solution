const controller = require("../controllers/reviewController");
const express = require("express");
const router = express.Router();
const { adminRoute } = require("../midellwares/auth");

router.param("reviewId", controller.getReviewId);
router.param("adminId", adminRoute);
// =================== Post ==============
router.post("/createReview", controller.createReview);

// =================== Get ===============
router.get("/getReviewById/:reviewId", controller.getReviewById);

// ================ Put ==============
router.put("/updateReview/:reviewId", controller.updateReview);

// =================== delete ==============
router.delete("/deleteReview/:reviewId", controller.deleteReview);

// ================== admin ==================
router.put("/disableReview/:reviewId/:adminId", controller.disableReview);

router.get("/getAllReview/:adminId", controller.getAllReview);

module.exports = router;
