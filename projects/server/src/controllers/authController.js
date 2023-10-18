const { Sequelize } = require("sequelize");
const db = require("../../models");
const User = db.User;
const Admin = db.Admin;
const Cart = db.Cart;
const Voucherdetail = db.Voucherdetail;
const Uservoucher = db.Uservoucher;
const tims = db.Transactionitem;
const ts = db.Transaction;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});
const URL = process.env.WHITELISTED_DOMAIN;
const transporter = require("../helpers/transporter");

const createRefCode = (length = 8) => {
  const characters = "ABCDEF789GHIstuJKLMN34OPQRST125UVWXYZabcdefghijklmnopqrvwxyz06";
  let refCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    refCode += characters.charAt(randomIndex);
  }

  return refCode;
};

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, phone, password, confirmpassword, refcode } = req.body;
      console.log(req.body);
      if (!(username || email || phone || password))
        return res.status(400).json({ message: "Please fill in all fields" });
      const finduser = await User.findOne({ where: { [Sequelize.Op.or]: [{ username }, { email }] } });
      if (finduser) return res.status(400).json({ message: "Username or Email already exists" });
      if (password !== confirmpassword) return res.status(400).json({ message: "Password does not match" });
      if (refcode) {
        const findRefUser = await User.findOne({ where: { refcode } });
        if (!findRefUser) return res.status(404).json({ message: "error, Ref code not found" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      await db.sequelize.transaction(async (t) => {
        const newUser = await User.create(
          {
            username,
            email,
            phone,
            password: hashPassword,
            role_id: 3,
            refcode: await createRefCode(),
            refby: refcode,
          },
          { transaction: t }
        );
        await Cart.create({ user_id: newUser.id, total_price: 0 }, { transaction: t });
        if (refcode) {
          const findRefUser = await User.findOne({ where: { refcode } });
          if (findRefUser) {
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            const newVoucher = await Voucherdetail.create(
              {
                name: "Referral Voucher",
                product_id: null,
                description: "Get 30% off for all products",
                nominal: null,
                percent: 30,
                type: "discount",
                expired: sevenDaysFromNow,
              },
              { transaction: t }
            );
            await Uservoucher.create(
              {
                user_id: newUser.id,
                voucherdetail_id: newVoucher.id,
                isused: false,
              },
              { transaction: t }
            );
          } else {
            return res.status(404).json({ message: "Ref code not found" });
          }
        }
        const token = jwt.sign({ id: newUser.id, username: username, email: email }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });
        const redirect = `${URL}/verification/${token}`;
        const data = await fs.readFile(path.resolve(__dirname, "../emails/registerEmail.html"), "utf-8");
        const tempCompile = await handlebars.compile(data);
        const tempResult = tempCompile({ username, email, redirect });
        console.log("ini");
        await transporter.sendMail({
          to: email,
          subject: "Verification Account",
          html: tempResult,
        });
        console.log("habis ini");
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
      if (checkUser.isverify === false) return res.status(500).json({ message: "Account is not verify" });
      const checkPassword = await bcrypt.compare(password, checkUser.password);
      if (!checkPassword) return res.status(500).json({ message: "Invalid Password" });
      let payload = {
        id: checkUser.id,
        email: checkUser.email,
        username: checkUser.username,
        birthdate: checkUser.birthdate,
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
      const token = jwt.sign({ findUser }, process.env.JWT_KEY);
      return res.status(200).json({ message: "Still Login", findUser, token: token });
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
  getAdmin: async (req, res) => {
    try {
      const findAdmin = await Admin.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return res.status(200).json({ message: "Admin", data: findAdmin });
    } catch (error) {
      return res.status(500).json({ message: "Failed", error: error.message });
    }
  },
  cancelTransaction: async (req, res) => {
    try {
      const {id} = req.user
      const {transaction_id} = req.params;
      const findTransaction = await ts.findOne({where : {user_id : id, id: transaction_id}})
      const findCart = await Cart.findOne({where : {user_id: id}})
      await db.sequelize.transaction(async(t) => {
        const result = await ts.update({status : 5},{where : {user_id : id, id: transaction_id}}, {transaction: t})
        const responseCart = await Cart.update({total_price: 0},{where : {user_id: id}}, {transaction: t})
      })
      return res.status(200).json({message : "Success"})
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  confirmOrder : async(req, res) => {
    try {
      const {transaction_id} = req.params
      const findTransaction = await ts.findOne({where : {id:transaction_id}})
      console.log("isi transaction", findTransaction)
      await db.sequelize.transaction(async(t) => {
        const result = await ts.update({status : 6}, {where : {id: transaction_id}}, {transaction : t})

        if (findTransaction.total_price >= 100000) {
          console.log("masuk sini");
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
          const newVoucher = await Voucherdetail.create({
            name: "Shop More, Save More",
            description: "Special discount after spending more than Rp.100.000",
            nominal: 20000,
            percent: null,
            type: "discount",
            expired: sevenDaysFromNow,
          });

          await Uservoucher.create({
            user_id: findTransaction.user_id,
            voucherdetail_id: newVoucher.id,
            isused: false,
          }, {transaction : t});
        };
      })
      return res.status(200).json({message : "AMAN DAHH", data : result})
    } catch (error) {
      return res.status(500).json({message : error.message})
    }
  }
};

module.exports = authController;
