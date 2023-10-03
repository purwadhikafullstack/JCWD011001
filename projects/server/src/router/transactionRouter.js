const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { verifyToken } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");

router.post("/", verifyToken, transactionController.checkout);
router.get("/", verifyToken, transactionController.getTransaction);
router.get("/done", verifyToken, transactionController.getFinishedTransaction);
router.patch("/upload", verifyToken, multerUpload.single("transaction_img"), transactionController.uploadProduct);
router.get("/user-transaction", transactionController.getAllUserTransaction)
router.get("/:id", verifyToken, transactionController.getTransactionItemOne);

module.exports = router;
