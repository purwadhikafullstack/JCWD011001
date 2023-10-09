const express = require("express");
const router = express.Router();
const userOrderController = require("../controllers/userOrderController");

router.get("/", userOrderController.getAllUserTransaction);
router.get("/daily", userOrderController.getSalesData);
router.get("/daily/:id", userOrderController.getBranchDailySales);
router.get("/store", userOrderController.getStoreData);
router.get("/branch/:id", userOrderController.getBranchUserTransaction)
router.get("/:id", userOrderController.getUserTransactionItem);

module.exports = router;