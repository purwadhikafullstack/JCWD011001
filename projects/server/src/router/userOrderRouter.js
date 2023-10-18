const express = require("express");
const router = express.Router();
const userOrderController = require("../controllers/userOrderController");
const { verifyToken } = require("../middleware/auth");

router.get("/", userOrderController.getAllUserTransaction);
router.get("/daily", userOrderController.getSalesData);
router.get("/branch-daily", verifyToken, userOrderController.getBranchDailySales);
router.get("/store", userOrderController.getStoreData);
router.get("/branch", verifyToken, userOrderController.getBranchUserTransaction)
router.get("/:id", userOrderController.getUserTransactionItem);

module.exports = router;