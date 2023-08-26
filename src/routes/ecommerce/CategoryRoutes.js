const controller = require("../../controllers/ecommerce/CategoryController");
const express = require("express");
const router = express.Router();
const { upload } = require("../../midellwares/multerMidellware");
const { adminRoute } = require("../../midellwares/auth");
const { isCategory } = require("../../midellwares/PermissionMidellware");

router.param("categoryId", controller.getCategoryId);
router.param("adminId", adminRoute);

//  ============ Get =========
router.get("/eCommerce/getByCategoryId/:categoryId", controller.getByCategoryId);
router.get("/eCommerce/getAllCategory", controller.getAllCategory);
// ================ Admin ===============

// ============== Post =============
router.post(
  "/eCommerce/createCategoryss/:adminId",
  isCategory,
  upload.fields([{ name: "banner" }, { name: "icon" }]),
  controller.createCategory
);

// ================= Put ==========
router.put(
  "/eCommerce/updateCategory/:categoryId/:adminId",
  isCategory,
  upload.fields([{ name: "banner" }, { name: "icon" }]),
  controller.updateCategory
);
router.put(
  "/eCommerce/disableCategory/:categoryId/:adminId",
  isCategory,
  controller.disableCategory
);
router.put("/eCommerce/unLinks/:categoryId/:adminId", isCategory, controller.unLinks);

// =================== Delete ==============
router.delete(
  "/eCommerce/deleteCategory/:categoryId/:adminId",
  isCategory,
  controller.deleteCategory
);

// =================== get ==============
router.get(
  "/eCommerce/getAllCategoryByAdmin/:adminId",
  isCategory,
  controller.getAllCategoryByAdmin
);
router.get(
  "/eCommerce/getAllCategoryWithPcategory/:adminId",
  isCategory,
  controller.getAllCategoryWithPcategory
);
router.get(
  "/eCommerce/getAllNullPcategory/:adminId",
  isCategory,
  controller.getAllNullPcategory
);
router.get(
  "/eCommerce/getCategoryWithPcategory/:pCategory/:adminId",
  isCategory,
  controller.getCategoryWithPcategory
);
module.exports = router;
