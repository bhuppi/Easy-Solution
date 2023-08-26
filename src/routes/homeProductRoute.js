const controller = require("../controllers/homeProductController");
const express = require("express");
const router = express.Router();
const { adminRoute } = require("../midellwares/auth");
// =================== Admin  =====================

// =================== Midellwares ===================
router.param("HomeProductId", controller.getHomeProductId);
router.param("adminId", adminRoute);
// ================= post ==================
router.post(
  "/createHomeProduct/:adminId",
  controller.createHomeProduct
);

// ==================== Put ==================
router.put(
  "/updateHomeProduct/:HomeProductId/:adminId",
  controller.updateHomeProduct
);

// =========== get =============
router.get(
  "/getAllHomeProduct/:adminId",
  controller.getAllHomeProduct
);
router.get(
  "/getByHomeProductId/:HomeProductId/:adminId",
  controller.getByHomeProductId
);

// =================== delete ================
router.delete(
  "/deleteHomeProduct/:HomeProductId/:adminId",
  controller.deleteHomeProduct
);

module.exports = router;
