const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginValidator, validateRegist } = require("../middleware/validator");
const { verifyToken } = require("../middleware/auth");

router.post("/user", authController.register);
router.post("/auth", loginValidator, validateRegist, authController.signIn)
router.get("/keep", verifyToken, authController.keepLogin)
router.patch("/verify", verifyToken, authController.verifyAccount)
router.get("/admin", authController.getAdmin)
router.patch("/transaction/:transaction_id",verifyToken, authController.cancelTransaction)

module.exports = router;
