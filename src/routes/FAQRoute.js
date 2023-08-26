const controller = require("../controllers/FAQController");
const express = require("express");
const router = express.Router();
const { adminRoute } = require("../midellwares/auth");
router.param("FAQId", controller.getFAQId);
router.param("adminId", adminRoute);

// ================ Get ===========
router.get("/getAllFAQ", controller.getAllFAQ);

// =============== Admin ============
// ================= Post ================
router.post("/createFAQ/:adminId", controller.createFAQ);

// ================== Get ================
router.get("/getByFAQId/:FAQId/:adminId", controller.getByFAQId);

// =============== Put ============
router.put("/updateFAQ/:FAQId/:adminId", controller.updateFAQ);

// ============== Delete ============
router.delete("/deleteFAQ/:FAQId/:adminId", controller.deleteFAQ);

module.exports = router;
