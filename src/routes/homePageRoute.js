const controller = require("../controllers/homePageController");
const express = require("express");
const router = express.Router();
// =================== get  =====================

router.get("/homePage", controller.homePage);

module.exports = router;
