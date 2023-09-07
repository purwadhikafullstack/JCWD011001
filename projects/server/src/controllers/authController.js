const { Sequelize } = require("sequelize");
const db = require("../../models");
const User = db.User;
const Admin = db.Admin;
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
        const newUser = await User.create(
          { username, email, phone, password: hashPassword, role_id: 3 },
          { transaction: t }
        );
        res.status(200).json({ message: "Register Success", data: newUser });
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  signIn: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!(email || password)) return res.status(500).json({ message: "Please complete the form" });
      const checkUser = await User.findOne({ where: { email } });
      if (!checkUser) return res.status(500).json({ message: "Account not defined" });
      const checkPassword = await bcrypt.compare(password, checkUser.password);
      if (!checkPassword) return res.status(500).json({ message: "Invalid Password" });
      let payload = {
        id: checkUser.id,
        email: checkUser.email,
        username: checkUser.username,
        name: checkUser.name,
        gender: checkUser.gender,
        refcode: checkUser.refcode,
      };
      const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "10h" });
      return res.status(200).json({ message: "Login Success", Account: checkUser, token: token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  keepLogin: async (req, res) => {
    try {
      const { id } = req.user;
      console.log(req.user);
      if (req.user.role) {
        const findAdmin = await Admin.findOne({ where: { id } });
        return res.status(200).json({ message: "Still Login", findAdmin });
      }
      const findUser = await User.findOne({ where: { id } });
      return res.status(200).json({ message: "Still Login", findUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  verifyAccount: async (req, res) => {
    try {
      const { id } = req.user;
      const users = await User.findOne({ where: { id } });
      if (users.dataValues.isverify === true) throw new Error("Already verify / token expired");
      await User.update(
        {
          isverify: true,
        },
        {
          where: {
            id,
          },
        }
      );
      return res.status(200).json({ message: "Verification Success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
