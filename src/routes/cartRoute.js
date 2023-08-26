const controller = require("../controllers/cartController");

const express = require("express");
const router = express.Router();
const { billDetail } = require("../midellwares/billDetail");
const { upload } = require("../midellwares/multerMidellware");
const Midellwares = require("../midellwares/userMidellware");

router.param("customerId", Midellwares.getUserId);
router.param("CartId", controller.getCartId);

// ================== Post ==================
router.post("/createCart", upload.single("image"), controller.createCart);

// ================== Get ==================
router.get(
  "/getAllCartBycustomerId/:customerId",
  billDetail,
  controller.getAllCartBycustomerId
);

// ================== Put ==================
router.put("/quantityUpdate/:CartId", controller.quantityUpdate);
router.put("/removeQuantity/:CartId", controller.removeQuantity);
router.put("/updateImage/:_id/:customerId",upload.single("image"),controller.updateImage)

// ================== Delete ==================
router.delete("/deleteCustomerCart/:customerId", controller.deleteCustomerCart);
router.delete("/deleteCartById/:CartId", controller.deleteCartById);

module.exports = router;
