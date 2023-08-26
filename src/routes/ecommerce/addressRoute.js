const controller = require("../../controllers/ecommerce/addressController");
const express = require("express");
const router = express.Router();
const {getUserId} = require("../../midellwares/userMidellware");

// =
router.param("AddressId",controller.getAddressId)
router.param("customerId",getUserId)

// ================== Post ===============
router.post("/createAddress", controller.create);

// =========== Get ============
router.get("/getAllAddressByCustomerId/:customerId", controller.getAllByCustomerId);
router.get("/getByAddressId/:AddressId", controller.getById);

// ============= Put ==============
router.put("/updateAddress/:AddressId", controller.updateAddress);

// ================ Delete ================
router.delete("/deleteAddress/:AddressId", controller.deleteAddress);

module.exports = router;
