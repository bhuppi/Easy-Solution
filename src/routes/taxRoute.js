const express = require("express");
const controller = require("../controllers/taxController");
const router = express.Router();
const { adminRoute } = require("../midellwares/auth");
router.param("adminId", adminRoute);
router.param("TaxtId", controller.getTaxtId);

// =============== Admin ===============
// ================= Get ============

router.get("/getTaxById/:TaxtId/:adminId", controller.getByTaxId);
router.get("/getAllTax/:adminId", controller.getAllTax);
// ==================== Put ===================

router.put("/updateTax/:TaxtId/:adminId", controller.updateTax);

module.exports = router;
