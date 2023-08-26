const controller = require("../controllers/contactUsControler");
const express = require("express");
const router = express.Router();
const { adminRoute } = require("../midellwares/auth");
router.param("ContactUsId", controller.getContactUsId);
router.param("adminId", adminRoute);


// ================ Get ===========
router.get("/getByContactUsId/:ContactUsId", controller.getByContactUsId);

// ================= Post ================
router.post("/createContactUs", controller.createContactUs);

// =============== Put ============
router.put("/updateContactUs/:ContactUsId", controller.updateContactUs);


// =============== Admin ============
// ============== Get ==============
router.get("/getAllContactUs/:adminId", controller.getAllContactUs);
// ============== Delete ============
router.delete("/deleteContactUs/:ContactUsId/:adminId", controller.deleteContactUs);

module.exports = router;
