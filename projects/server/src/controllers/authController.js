const { Sequelize } = require("sequelize");
const db = require("../../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, phone, password, confirmpassword } = req.body;
      if (!(username || email || phone || password))
        return res.status(400).json({ message: "Please fill in all fields" });
      const finduser = await User.findOne({ where: { [Sequelize.Op.or]: [{ username }, { email }] } });
      if (finduser) return res.status(400).json({ message: "Username or Email already exists" });
      if (password !== confirmpassword) return res.status(400).json({ message: "Password does not match" });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      await db.sequelize.transaction(async (t) => {
        const newUser = await User.create({ username, email, phone, password: hashPassword }, { transaction: t });
        res.status(200).json({ message: "Register Success", data: newUser });
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = authController;
