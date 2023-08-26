const controller = require("../../controllers/ecommerce/ProductController");
const express = require("express");
const router = express.Router();
const { upload } = require("../../midellwares/multerMidellware");
const midellwares = require("../../midellwares/datefilter");
const { adminRoute } = require("../../midellwares/auth");
const { isProduct } = require("../../midellwares/PermissionMidellware");
// =================== Midellware ==============
router.param("productId", controller.getProductId);
router.param("adminId", adminRoute);
// ============= get =============
router.get("/eCommerce/getByProductId/:productId", controller.getByProductId);
router.get("/eCommerce/getAllProduct", controller.getAllProduct);

// =================== Admin ================

// ================= Post ==============
router.post(
  "/eCommerce/createProduct/:adminId",
  isProduct,
  upload.fields([
    { name: "images" },
    { name: "additional" },
    { name: "thumnail" },
  ]),
  controller.createProduct
);

// ============================= Get ==================
router.get(
  "/eCommerce/filterProductByDate/:adminId",
  isProduct,
  midellwares.date,
  controller.filterProductByDate
);

// ===================== Put ===============
router.put(
  "/eCommerce/updateProduct/:productId/:adminId",
  isProduct,
  upload.fields([
    { name: "images" },
    { name: "additional" },
    { name: "thumnail" },
  ]),
  controller.updateProduct
);
router.put(
  "/eCommerce/disableProduct/:productId/:adminId",
  isProduct,
  controller.disableProduct
);
router.put(
  "/eCommerce/productUnLinks/:productId/:adminId",
  isProduct,
  controller.productUnLinks
);

// ===================== Delete ==============
router.delete(
  "/eCommerce/deleteProduct/:productId/:adminId",
  isProduct,
  controller.deleteProduct
);

module.exports = router;
