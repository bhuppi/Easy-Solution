const controller = require("../../controllers/ecommerce/homeProductController");
const express = require("express");
const router = express.Router();
const { adminRoute } = require("../../midellwares/auth");
// =================== Admin  =====================

// =================== Midellwares ===================
router.param("HomeProductId", controller.getHomeProductId);
router.param("adminId", adminRoute);
// ================= post ==================
router.post(
  "/eCommerce/createHomeProduct/:adminId",
  controller.createHomeProduct
);

// ==================== Put ==================
router.put(
  "/eCommerce/updateHomeProduct/:HomeProductId/:adminId",
  controller.updateHomeProduct
);

// =========== get =============
router.get(
  "/eCommerce/getAllHomeProduct/:adminId",
  controller.getAllHomeProduct
);
router.get(
  "/eCommerce/getByHomeProductId/:HomeProductId/:adminId",
  controller.getByHomeProductId
);

// =================== delete ================
router.delete(
  "/eCommerce/deleteHomeProduct/:HomeProductId/:adminId",
  controller.deleteHomeProduct
);

module.exports = router;
