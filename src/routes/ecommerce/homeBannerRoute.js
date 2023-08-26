const controller = require("../../controllers/ecommerce/homeBannerController");
const { upload } = require("../../midellwares/multerMidellware");
const express = require("express");
const router = express.Router();
const { adminRoute } = require("../../midellwares/auth");
const { isHomebanner } = require("../../midellwares/PermissionMidellware");
// =================== Addmin  =====================

// =================== Midellwares ===================
router.param("HomeBannerId", controller.getHomeBannerId);
router.param("adminId", adminRoute);
// ================= post ==================
router.post(
  "/eCommerce/createHomeBanner/:adminId",
  isHomebanner,
  upload.single("banner"),
  controller.createHomeBanner
);

// ==================== Put ==================
router.put(
  "/eCommerce/updateHomeBanner/:HomeBannerId/:adminId",
  isHomebanner,
  upload.single("banner"),
  controller.updateHomeBanner
);

// =========== get =============
router.get(
  "/eCommerce/getAllHomeBanner/:adminId",
  isHomebanner,
  controller.getAllHomeBanner
);
router.get(
  "/eCommerce/getByHomeBannerId/:HomeBannerId/:adminId",
  controller.getByHomeBannerId
);

// =================== delete ================
router.delete(
  "/eCommerce/deleteHomeBanner/:HomeBannerId/:adminId",
  isHomebanner,
  controller.deleteHomeBanner
);
module.exports = router;
