const controller = require("../../controllers/ecommerce/brandController");
const express = require("express");
const router = express.Router();
const { adminRoute } = require("../../midellwares/auth");
const { upload } = require("../../midellwares/multerMidellware");
router.param("brandId", controller.getbrandId);
router.param("adminId", adminRoute);

// ================ Get ===========
router.get("/getByBrandId/:brandId", controller.getByBrandId);
router.get("/getAllBrand", controller.getAllBrand);

// =============== Admin ============
// ================= Post ================
router.post(
  "/createBrand/:adminId",
  upload.single("image"),
  controller.createBrand
);

// ============== Get ==============
router.get("/getAllBrandByAdmin/:adminId", controller.getAllBrandByAdmin);

// =============== Put ============
router.put(
  "/updatebrand/:brandId/:adminId",
  upload.single("image"),
  controller.updatebrand
);
router.put("/disablebrand/:brandId/:adminId", controller.disablebrand);

// ============== Delete ============
router.delete("/deleteBrand/:brandId/:adminId", controller.deleteBrand);

module.exports = router;
