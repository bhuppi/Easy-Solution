const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
const midellwares = require("../midellwares/datefilter");
const Midellwares = require("../midellwares/userMidellware");
const { dashBoard } = require("../controllers/dashBoard");
const { adminRoute } = require("../midellwares/auth");
const { isOrder } = require("../midellwares/PermissionMidellware");

// ================ Midellwares ============
router.param("userId", Midellwares.getUserId);
router.param("OrderId", controller.getOrderId);
router.param("adminId", adminRoute);

// ================ Post ===============
router.post("/createOrder", controller.createOrder);

// =============== get =============
router.get(
  "/getAllOrderByCostomerId/:userId",
  controller.getAllOrderByCostomerId
);

// ================ Put ============
router.put("/cancelOrder/:OrderId/:userId", controller.cancelOrder);
router.put(
  "/updateTransactionId/:OrderId",
  controller.updateTransactionId
);
router.put(
  "/updateCompletedStatus/:OrderId",
  controller.updateCompletedStatus
);
router.put(
  "/updateWorkingStatus/:OrderId",
  controller.updateWorkingStatus
);

router.put(
  "/onTheWayStatusUpdate/:OrderId/:userId",
  controller.onTheWayStatusUpdate
);
router.put(
  "/acceptedStatusUpdate/:OrderId/:userId",
  controller.acceptedStatusUpdate
);

// ============= Get ===========
router.get("/getOrderByOrderId/:OrderId", controller.getOrderByOrderId);
router.get("/getOrderByPartnerId/:userId", controller.getOrderByPartnerId);

// ============== admin ==============
router.post(
  "/createOrderByAdmin/:adminId",
  isOrder,
  controller.createOrderByAdmin
);
router.get(
  "/filterOrderByDate/:adminId",
  isOrder,
  midellwares.date,
  controller.filterOrderByDate
);
router.put(
  "/cancelOrderByAdmin/:OrderId/:adminId",
  isOrder,
  controller.cancelOrder
);
router.put(
  "/assignePartnerByAdmin/:OrderId/:userId/:adminId",
  isOrder,
  controller.AssignePartnerByAdmin
);
router.get("/dashBoard/:adminId", isOrder, dashBoard);

module.exports = router;
