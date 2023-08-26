const controller = require("../controllers/couponController");
const express = require("express");
const router = express.Router();
const { upload } = require("../midellwares/multerMidellware");
const { adminRoute } = require("../midellwares/auth");
const { isCoupon } = require("../midellwares/PermissionMidellware");
router.param("couponId", controller.getCouponId);
router.param("adminId", adminRoute);




// ================= Get ==================
router.get("/getAllCoupon", controller.getAllCoupon);
router.get(
  "/getCouponById/:couponId",
  controller.getCouponById
);

// ================== Admin =============

// ================== Post ================
router.post(
  "/creatCoupon/:adminId",
  isCoupon,
  upload.single("icon"),
  controller.creatCoupon
);

// ================== Put ================
router.put(
  "/updateCoupon/:couponId/:adminId",
  isCoupon,
  upload.single("icon"),
  controller.updateCoupon
);
router.put(
  "/disableCoupon/:couponId/:adminId",
  isCoupon,
  controller.disableCoupon
);
router.get(
  "/getAllCouponByAdmin/:adminId",
  isCoupon,
  controller.getAllCouponByAdmin
);

module.exports = router;
