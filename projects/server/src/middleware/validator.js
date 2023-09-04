const {body, validationResult} = require("express-validator")

const loginValidator = [
    body("email").notEmpty().withMessage("Email cannot be empty")
    .isEmail().withMessage("Invalid email address format"),
    body("password").notEmpty().withMessage("Password cannot be empty")
    .matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/)
    .withMessage("Password must contain 8 character, one uppercase, one number, and one special case character"),
]

const validateRegist = (req, res, next) => {
    const errors = validationResult(req);
  //   validationResult memiliki method isEmpty untuk mengembalikan nilai true/false
    if (errors.isEmpty() === false) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

module.exports = {loginValidator, validateRegist}