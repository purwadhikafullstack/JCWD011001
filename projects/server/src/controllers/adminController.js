const db = require("../../models");
const { Sequelize } = require("sequelize");
const Admin = db.Admin;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      let where = {};

      if (email) where.email = email;

      const checkLogin = await Admin.findOne({ where });
      console.log(checkLogin);
      if (!checkLogin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const passwordValid = await bcrypt.compare(password, checkLogin.password);
      console.log("pass:", passwordValid);
      if (!passwordValid)
        return res.status(404).json({ message: "Incorrect password" });

      let payload = {
        id: checkLogin.id,
        name: checkLogin.name,
        email: checkLogin.email,
        role: checkLogin.role_id,
      };

      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "24h",
      });

      return res.status(200).json({ message: "Login success", Account: checkLogin, token: token });
    } catch (error) {
      return res.status(500).json({ message: "Login failed", error: error.message });
    }
  },

  keepAdminLogin: async (req, res) => {
    try {
      const { id } = req.user;
      const findAdmin = await Admin.findOne({ where: { id } });
      return res.status(200).json({ message: "Still Login", findAdmin });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createBranchAdmin: async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (!(name || email || password))
        return res.status(400).json({ message: "Please fill in all fields" });
      const findAdmin = await Admin.findOne({
        where: { [Sequelize.Op.or]: [{ name }, { email }] },
      });
      if (findAdmin)
        return res.status(400).json({ message: "Name or Email already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      await db.sequelize.transaction(async (t) => {
        const newBranchAdmin = await Admin.create(
          { name, email, password: hashPassword, role_id: 2 },
          { transaction: t }
        );
        res.status(200).json({ message: "Branch admin is created successfully", data: newBranchAdmin });
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAdmins: async (req, res) => {
    try {
      const admin = await Admin.findAll({ where: { role_id: 2 } });
      return res.status(200).json({ message: "Admins retrieved successfully", data: admin });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve admins", error: error.message });
    }
  },

  // getAdminsById: async (req, res) => {
  //   try {
  //     const { id } = req.params.id;
  //     const admin = await Admin.findOne({ where: { id: id } });
  //     return res.status(200).json({ message: "Admin retrieved successfully", data: admin });
  //   } catch (error) {
  //     return res.status(500).json({ message: "Failed to retrieve admin", error: error.message });
  //   }
  // },
};

module.exports = adminController;
