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
router.patch("/stock",verifyToken, adminController.updateStock)
router.post("/branch/stock", verifyToken, adminController.branchStock)
router.get("/product/branch",verifyToken, adminController.getStockBranch)
router.patch("/delete/:id", adminController.deActiveProductBranch)
router.patch("/enable/:id", adminController.enableProductBranch)
router.get("/branch/user", adminController.getUsers)
router.get("/branch/user/transaction/:user_id", adminController.getUserTransaction)
router.patch("/branch/cancel/:transaction_id", adminController.cancelUserTransaction)
router.get("/branch/transaction", adminController.getAllTransaction)
module.exports = router;