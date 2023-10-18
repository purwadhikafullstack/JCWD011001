const express = require("express");
const profileController = require("../controllers/profileController");
const { verifyName, verifyToken, verifyEmail, verifyPassword } = require("../middleware/auth");
const { changeNameValidator, validateRegist, birthdateValidator, genderValidator, changeEmailValidator, changePasswordValidator, forgotPasswordValidator, resetPasswordValidator } = require("../middleware/validator");
const { multerUpload } = require("../middleware/multer");
const router = express.Router();

router.patch("/auth/name", verifyToken,verifyName, changeNameValidator, validateRegist,profileController.patchChangeName)
router.patch("/auth/gender", verifyToken, genderValidator,validateRegist, profileController.patchChangeGender)
router.patch("/auth/birthdate", verifyToken, birthdateValidator,validateRegist, profileController.patchChangeBirthdate)
router.patch("/auth/email", verifyToken,verifyEmail,changeEmailValidator,validateRegist,profileController.pacthChangeEmail)
router.patch("/auth/password", verifyToken,verifyPassword,changePasswordValidator,validateRegist,profileController.patchChangePassword)
router.put("/profile/forgot", forgotPasswordValidator,validateRegist,profileController.forgotPassword)
router.patch("/profile/reset", verifyToken, resetPasswordValidator,validateRegist,profileController.resetPassword)
router.patch("/profile/picture", verifyToken, multerUpload.single("profileimg"), profileController.changeProfilePicture)

module.exports = router