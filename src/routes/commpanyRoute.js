const controller = require("../controllers/commpanyController");
const express = require("express");
const { upload } = require("../midellwares/multerMidellware");
const router = express.Router();
const { adminRoute } = require("../midellwares/auth");
router.param("adminId",adminRoute)
router.put(
  "/update/company/:adminId",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "loader", maxCount: 1 },
    { name: "fav_icon", maxCount: 1 },
    { name: "header_logo", maxCount: 1 },
    { name: "footer_logo", maxCount: 1 },
  ]),
  controller.updateCompany
);
router.get("/get/company", controller.getCompany);

router.get("/getCompanyByAdmin/:adminId", controller.getCompanyByAdmin);
module.exports = router;
