const controller = require("../../controllers/ecommerce/CartController");

const express = require("express");
const router = express.Router();
const { billDetail } = require("../../midellwares/billDetail");
const Midellwares = require("../../midellwares/userMidellware");

router.param("customerId", Midellwares.getUserId);
router.param("CartId", controller.getCartId);

// ================== Post ==================
router.post("/eCommerce/createCart", controller.createCart);

// ================== Get ==================
router.get(
  "/eCommerce/getAllCartBycustomerId/:customerId",
  billDetail,
  controller.getAllCartBycustomerId
);

// ================== Put ==================
router.put("/eCommerce/quantityUpdate/:CartId", controller.quantityUpdate);
router.put("/eCommerce/removeQuantity/:CartId", controller.removeQuantity);

// ================== Delete ==================
router.delete("/eCommerce/deleteCustomerCart/:customerId", controller.deleteCustomerCart);
router.delete("/eCommerce/deleteCartById/:CartId", controller.deleteCartById);

module.exports = router;
