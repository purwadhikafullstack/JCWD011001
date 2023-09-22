const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, transactionController.getTransaction);
router.get("/done", verifyToken, transactionController.getFinishedTransaction);
router.get("/:id", verifyToken, transactionController.getTransactionItemOne);

module.exports = router;
