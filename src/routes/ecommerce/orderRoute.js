const controller = require("../../controllers/ecommerce/orderController");
const express = require("express");
const router = express.Router();
const { getUserId } = require("../../midellwares/userMidellware");
const { adminRoute } = require("../../midellwares/auth");
router.param("customerId", getUserId);
router.param("orderId", controller.getOrderId);
router.param("adminId", adminRoute);
// ================== Post ===============
router.post("/eCommerce/createOrder", controller.createOrder);
// ============= Get ================
router.get("/eCommerce/getByOrderId/:orderId", controller.getByOrderId);
router.get(
  "/eCommerce/getOrderByCustomerId/:customerId",
  controller.getOrderByCustomerId
);

// ================== Put ===============
router.put("/eCommerce/cancelOrder/:orderId", controller.cancelOrder);
router.put(
  "/eCommerce/returnRequestOrde/:orderId",
  controller.returnRequestOrder
);
router.put(
  "/eCommerce/updateTransitionId/:orderId",
  controller.updateTransitionId
);

// ================ Admin ===============
// =========== Put ============
router.put(
  "/eCommerce/updateAllProductStatus/:orderId/:adminId",
  controller.updateAllProductStatus
);
router.put(
  "/eCommerce/updateSingleStatus/:orderId/:adminId",
  controller.updateSingleStatus
);

module.exports = router;
