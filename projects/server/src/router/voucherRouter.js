const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const voucherController = require("../controllers/voucherController");

router.post("/", voucherController.createDiscountVoucher);
router.get("/admin", voucherController.getAdminVoucher);
router.get("/user", verifyToken, voucherController.getUserVoucher);
router.patch("/:id", voucherController.deleteVoucher);
router.get("/delivery", verifyToken, voucherController.getFreeDeliveryVoucher);

module.exports = router;