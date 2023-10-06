const express = require("express");
const router = express.Router();
const userOrderController = require("../controllers/userOrderController");

router.get("/", userOrderController.getAllUserTransaction);
router.get("/store", userOrderController.getStoreData);
router.get("/:id", userOrderController.getUserTransactionItem);

module.exports = router;