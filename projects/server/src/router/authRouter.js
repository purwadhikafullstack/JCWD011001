const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginValidator, validateRegist } = require("../middleware/validator");
const { verifyToken } = require("../middleware/auth");

router.post("/user", authController.register);
router.post("/auth", loginValidator, validateRegist, authController.signIn)
router.get("/keep", verifyToken, authController.keepLogin)

module.exports = router;
