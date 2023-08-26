const controller = require("../controllers/categoryController");
const express = require("express");
const router = express.Router();
const { upload } = require("../midellwares/multerMidellware");
const { adminRoute } = require("../midellwares/auth");
const { isCategory } = require("../midellwares/PermissionMidellware");

router.param("categoryId", controller.getCategoryId);
router.param("adminId", adminRoute);
//  ============ Get =========
router.get("/getByCategoryId/:categoryId", controller.getByCategoryId);
router.get("/getCityIdCategory/:cityId", controller.getCityIdCategory);
router.get("/getAllCategory", controller.getAllCategory);
router.get("/getCategoryWithPcategoryByUser/:pCategory",controller.getCategoryWithPcategoryByUser)
router.get("/getProductBySubCategory/:categoryId",controller.getProductBySubCategory)
// ================ Admin ===============

// ============== Post =============
router.post(
  "/createCategory/:adminId",
  isCategory,
  upload.fields([{ name: "banner" }, { name: "icon" }]),
  controller.createCategory
);

// ================= Put ==========
router.put(
  "/updateCategory/:categoryId/:adminId",
  isCategory,
  upload.fields([{ name: "banner" }, { name: "icon" }]),
  controller.updateCategory
);
router.put(
  "/disableCategory/:categoryId/:adminId",
  isCategory,
  controller.disableCategory
);
router.put("/unLinks/:categoryId/:adminId", isCategory, controller.unLinks);

// =================== Delete ==============
router.delete(
  "/deleteCategory/:categoryId/:adminId",
  isCategory,
  controller.deleteCategory
);

// ================= Get ==================
router.get(
  "/getAllCategoryByAdmin/:adminId",
  isCategory,
  controller.getAllCategoryByAdmin
);
router.get(
  "/getAllCategoryWithPcategory/:adminId",
  isCategory,
  controller.getAllCategoryWithPcategory
);
router.get(
  "/getAllNullPcategory/:adminId",
  isCategory,
  controller.getAllNullPcategory
);
router.get(
  "/getCategoryWithPcategory/:pCategory/:adminId",
  isCategory,
  controller.getCategoryWithPcategory
);
module.exports = router;
