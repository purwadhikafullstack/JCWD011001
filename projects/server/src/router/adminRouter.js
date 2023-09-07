const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middleware/auth");
const { createBranchAdmin, validateRegist } = require("../middleware/validator");

router.post("/", adminController.login);
router.get("/keep", verifyToken, adminController.keepAdminLogin);
router.post("/branch-admin", verifyToken, createBranchAdmin, validateRegist, adminController.createBranchAdmin);
// router.get("/branch/:id", adminController.getAdminsById);
router.get("/branch-admin", adminController.getAdmins);

module.exports = router;