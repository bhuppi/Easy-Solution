const express = require("express");
const controller = require("../controllers/userController");
const Midellwares = require("../midellwares/userMidellware");
const router = express.Router();
const { adminRoute } = require("../midellwares/auth");
const {upload} = require("../midellwares/multerMidellware")
// ================== Midellwares ================== ||
router.param("userId", Midellwares.getUserId);
router.param("adminId", adminRoute);

// ============= Post =============
router.post("/register",controller.register)
router.post("/login/customer", Midellwares.getUserCustomer, controller.login);
router.post("/login/partner", Midellwares.getUserPartner, controller.login);
router.post("/sendOtp", controller.sendOtp);
// =============== Put ==========
router.put("/updateUser/:userId",upload.single("image"), controller.updateUser);

// =============== get ===========
router.get("/getUserById/:userId", controller.getUserById);

// =============== admin =========

// ==================== post ===================
router.post("/adminLogin",controller.adminLogin)
router.post("/craeteAdminAndSubAdmin",controller.craeteAdminAndSubAdmin)

// ======================= get =====================
router.get("/getUserByPhoneNumber/:adminId", controller.getUserByPhoneNumber);
router.get("/getAllUser/:adminId", controller.getAllUser);
router.get("/getUserBYToken", controller.getUserBYToken);

// ========================== Put =======================
router.put("/disableUser/:userId/:adminId", controller.disableUser);

module.exports = router;
