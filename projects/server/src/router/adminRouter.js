const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middleware/auth");
const { createBranchAdmin, validateRegist } = require("../middleware/validator");

router.post("/", adminController.login);
router.post("/branch-admin", createBranchAdmin, validateRegist, adminController.createBranchAdmin);
// router.get("/branch/:id", adminController.getAdminsById);
router.get("/branch-admin", adminController.getBranchAdmin);
router.patch("/branch-admin/:id", adminController.deleteBranchAdmin);
router.get("/product", adminController.fetchProduct)
router.delete("/product/:productId", adminController.deleteProduct)

module.exports = router;