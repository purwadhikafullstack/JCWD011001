const express = require("express");
const profileController = require("../controllers/profileController");
const { verifyName, verifyToken, verifyEmail, verifyPassword } = require("../middleware/auth");
const { changeNameValidator, validateRegist, birthdateValidator, genderValidator, changeEmailValidator, changePasswordValidator, forgotPasswordValidator, resetPasswordValidator } = require("../middleware/validator");
const { multerUpload } = require("../middleware/multer");
const router = express.Router();

router.patch("/name", verifyToken,verifyName, changeNameValidator, validateRegist,profileController.patchChangeName)
router.patch("/gender", verifyToken, genderValidator,validateRegist, profileController.patchChangeGender)
router.patch("/birthdate", verifyToken, birthdateValidator,validateRegist, profileController.patchChangeBirthdate)
router.patch("/email", verifyToken,verifyEmail,changeEmailValidator,validateRegist,profileController.pacthChangeEmail)
router.patch("/password", verifyToken,verifyPassword,changePasswordValidator,validateRegist,profileController.patchChangePassword)
router.put("/forgot", forgotPasswordValidator,validateRegist,profileController.forgotPassword)
router.patch("/reset", verifyToken, resetPasswordValidator,validateRegist,profileController.resetPassword)
router.patch("/picture", verifyToken, multerUpload.single("profileimg"), profileController.changeProfilePicture)
router.patch("/resend/verification", verifyToken, profileController.resendVerification)
module.exports = router