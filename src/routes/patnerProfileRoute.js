const express = require("express");
const controller = require("../controllers/partnerProfileController");
const midellwares = require("../midellwares/multerMidellware");
const router = express.Router();
const { adminRoute } = require("../midellwares/auth");
const {profileVerificetionCompleted} = require("../midellwares/partnerProfileMidellware")
// ================== Midellwares ================== ||
router.param("PartnerProfileId", controller.getPartnerProfileId);
router.param("adminId", adminRoute);
// ============= Post =============
router.post(
  "/createPartnerProfile",
  midellwares.upload.fields([{ name: "selfie" }, { name: "image" }]),
  controller.createPartnerProfile
);

// =============== Put ==========
router.put(
  "/updatePartnerProfile/:PartnerProfileId",
  midellwares.upload.fields([{ name: "selfie" }, { name: "image" }]),
  controller.updatePartnerProfile
);
router.put(
  "/updateDocumentPartnerProfile/:PartnerProfileId",
  midellwares.upload.single("image"),
  controller.updateDocumentPartnerProfile
);
router.put(
  "/updateSelfiePartnerProfile/:PartnerProfileId",
  midellwares.upload.single("selfie"),
  controller.updateSelfiePartnerProfile
);

// =============== get ===========
router.get(
  "/getBypartnerProfileId/:PartnerProfileId",
  controller.getBypartnerProfileId
);

// ===================== delete =============
router.delete(
  "/deletepartnerProfiler/:PartnerProfileId",
  controller.deletepartnerProfile
);

// =============== admin =========
router.get("/getAllpartnerProfile/:adminId", controller.getAllpartnerProfile);
router.put(
  "/disablepartnerProfile/:PartnerProfileId/:adminId",
  controller.disablepartnerProfile
);
router.put(
  "/updateDocumentStatus/:PartnerProfileId/:adminId",profileVerificetionCompleted,
  controller.updateDocumentStatus
);

module.exports = router;
