const db = require("../models");
const { Sequelize, Op, where } = require("sequelize");
const Admin = db.Admin;
const Store = db.Store;
const productStore = db.ProductStore;
const stockHistory = db.Storestockhistory;
const trans = db.Transaction;
const Transactionitem = db.Transactionitem;
const user = db.User;
const cart = db.Cart;
const { Product, Category } = db;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const KEY = process.env.KEY;
const axios = require("axios");

let includeStore = [
  {
    model: Store,
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: { isactive: true },
  },
];
const includeCategory = [
  { model: Category, attributes: { exclude: ["createdAt", "updatedAt"] } },
];
const includeProduct = [
  {
    model: Product,
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: { isactive: true },
    include: includeCategory,
  },
];
const setPagination = (limit, page) => {
  const offset = (page - 1) * +limit;
  return { limit: parseInt(limit), offset };
};

const adminController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      let where = {};

      if (email) where.email = email;

      const checkLogin = await Admin.findOne({ where });

      const checkBranch = await Store.findOne({
        where: { admin_id: checkLogin.id },
        attributes: {
          exclude: [
            "admin_id",
            "longitude",
            "latitude",
            "createdAt",
            "updatedAt",
            "isactive",
          ],
        },
      });
      if (!checkLogin.isactive) {
        return res.status(401).json({ message: "Admin is not active" });
      }

      if (checkLogin.role_id === 1) {
        const passwordValid = await bcrypt.compare(
          password,
          checkLogin.password
        );
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

        return res.status(200).json({
          message: "Login success",
          Account: checkLogin,
          BranchData: {},
          token: token,
        });
      }

      if (!checkLogin || !checkBranch) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const passwordValid = await bcrypt.compare(password, checkLogin.password);
      if (!passwordValid)
        return res.status(404).json({ message: "Incorrect password" });

      checkLogin.store_id = checkBranch.id;

      let payload = {
        id: checkLogin.id,
        name: checkLogin.name,
        email: checkLogin.email,
        role: checkLogin.role_id,
        store_id: checkBranch.id,
      };

      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "24h",
      });

      return res.status(200).json({
        message: "Login success",
        Account: checkLogin,
        BranchData: checkBranch,
        token: token,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Login failed", error: error.message });
    }
  },

  createBranchAdmin: async (req, res) => {
    try {
      const { name, email, branch, password, confirmPassword, city_id } =
        req.body;
      const findAdmin = await Admin.findOne({
        where: { [Sequelize.Op.or]: [{ name }, { email }, {}] },
      });
      if (findAdmin)
        return res.status(400).json({ message: "Name or Email already exists" });

      const branchAdminExist = await Store.findOne({
        where: { location: branch, isactive: true },
      });

      if (branchAdminExist?.admin_id > 1) {
        return res
          .status(400)
          .json({ message: "Admin in this branch already exists" });
      }
      if (branchAdminExist) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);

          const newBranchAdmin = await Admin.create({
            name,
            email,
            password: hashPassword,
            role_id: 2,
            isactive: true,
          });
          branchAdminExist.admin_id = newBranchAdmin.id;
          await branchAdminExist.save();
          return res.status(200).json({ message: "Branch admin is created" });
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const location = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${KEY}&q=${branch}&language=id`
      );

      const latitude = location.data.results[0].geometry.lat;
      const longitude = location.data.results[0].geometry.lng;

      await db.sequelize.transaction(async (t) => {
        const newBranchAdmin = await Admin.create(
          { name, email, password: hashPassword, role_id: 2 },
          { transaction: t }
        );
        const newBranch = await Store.create(
          {
            name: `Branch ${branch}`,
            location: branch,
            admin_id: newBranchAdmin.id,
            latitude,
            longitude,
            city_id: city_id,
            isactive: true,
          },
          { transaction: t }
        );
        res.status(200).json({
          message: "Branch admin is created successfully",
          admin_data: newBranchAdmin,
          store_data: newBranch,
        });
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getBranchAdmin: async (req, res) => {
    try {
      const admins = await Store.findAll({
        include: [
          {
            model: Admin,
            where: { role_id: 2, isactive: true },
            attributes: ["name", "email"],
            required: false,
          },
        ],
        where: { isactive: true, admin_id: { [Op.ne]: 1 } },
      });

      return res.status(200).json({
        message: "Branch admins retrieved successfully",
        data: admins,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to retrieve branch admins",
        error: error.message,
      });
    }
  },

  deleteBranchAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      await db.sequelize.transaction(async (t) => {
        await Admin.update(
          { isactive: false },
          { where: { id }, transaction: t }
        );

        await Store.update(
          { admin_id: 1 },
          { where: { admin_id: id }, transaction: t }
        );
        return res.status(200).json({ message: "Admin is deleted" });
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to delete admin", error: error.message });
    }
  },

  fetchProduct: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        order = "ASC",
        orderBy = "name",
        category = "",
        name = "",
      } = req.query;

      const findName = { name: { [Op.like]: `%${name || ""}%` } };
      const pagination = { offset: (page - 1) * limit, limit: +limit };
      let totalProductQuery = {};

      const where = {};

      if (category) {
        where.category_id = category;
        totalProductQuery = { category_id: category };
      }

      let orderByColumn;
      if (orderBy === "price") {
        orderByColumn = Sequelize.literal("price");
      } else {
        orderByColumn = Sequelize.col(orderBy);
      }

      const totalProduct = await Product.count({
        where: totalProductQuery,
      });
      const totalPage = Math.ceil(totalProduct / +limit);

      const products = await Product.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "category_id"],
        },
        include: [{ model: Category, as: "Category" }],
        ...pagination,
        where: { ...findName, ...where },
        order: [[orderByColumn, order]],
      });

      res
        .status(200)
        .json({ page, totalProduct, totalPage, limit, data: products });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const checkProduct = await Product.findOne({ where: { id: productId } });
      await db.sequelize.transaction(async (t) => {
        const response = await Product.destroy(
          { where: { id: productId } },
          { transaction: t }
        );
      });
      return res.status(200).json({ message: "Success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  branchStock: async (req, res) => {
    try {
      const { productId, quantity, description } = req.body;
      // let description = "Update Stock"
      const findStore = await Store.findOne({where : {admin_id : req.user.id}})
      const existingProductStore = await productStore.findOne({
        where: { product_id: productId, store_id: findStore.id },
      });
      const existingStoresHistory = await stockHistory.findOne({
        where: { product_id: productId, store_id: findStore.id },
      });
      if (existingProductStore) {
        let quantityUpdate;
        quantityUpdate = existingProductStore.quantity + quantity;
        existingProductStore.quantity = quantityUpdate;
        await existingProductStore.save();
        await db.sequelize.transaction(async (t) => {
          await stockHistory.create(
            {
              product_id: productId,
              store_id: findStore.id,
              quantity: quantityUpdate,
              isactive: true,
              description: `Update Stock ${quantity} pcs`,
            },
            { transaction: t }
          );
        });
        return res.status(200).json({ message: "Update Success" });
      } else {
        await db.sequelize.transaction(async (t) => {
          await productStore.create(
            {
              product_id: productId,
              store_id: findStore.id,
              quantity: quantity,
              isactive: true,
            },
            { transaction: t }
          );
          await stockHistory.create(
            {
              product_id: productId,
              store_id: findStore.id,
              quantity: quantity,
              isactive: true,
              description: `Update Stock ${quantity} pcs`,
            },
            { transaction: t }
          );
        });
        return res.status(200).json({ message: "Sucess" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deActiveProductBranch: async (req, res) => {
    try {
      const { id } = req.params;
      const findProduct = await productStore.findOne({ where: { id } });
      await db.sequelize.transaction(async (t) => {
        await productStore.update(
          {
            isactive: false,
          },
          { where: { id } },
          { transaction: t }
        );
      });
      return res.status(200).json({ message: "Success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  enableProductBranch: async (req, res) => {
    try {
      const { id } = req.params;
      const findProduct = await productStore.findOne({ where: { id } });
      await db.sequelize.transaction(async (t) => {
        await productStore.update(
          {
            isactive: true,
          },
          { where: { id } },
          { transaction: t }
        );
      });
      return res.status(200).json({ message: "Enable Success" });
    } catch (error) {}
  },
  getStockBranch: async (req, res) => {
    try {
      const { product_name = "", page = 1 } = req.query;
      const findProduct = {
        "$Product.name$": { [Op.like]: `%${product_name || ""}%` },
      };
      const store = await Store.findOne({ where: { admin_id: req.user.id } });
      if (!store) {
        return res
          .status(404)
          .json({ message: "Store not found for the user." });
      }
      const where = { store_id: store.id };
      const findBranch = await productStore.findAll({
        where: {
          store_id: store.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "category_id"],
        },
        include: [
          {
            model: Product,
            attributes: ["name", "product_img", "price", "admin_discount"],
          },
        ],
        where: { ...findProduct, ...where },
      });
      return res.status(200).json({ message: "Success", datas: findBranch });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const { id } = req.params;
      const checkUser = await user.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return res.status(200).json({ message: "Success", data: checkUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUserTransaction: async (req, res) => {
    try {
      const { user_id } = req.params;
      const checkTrans = await trans.findOne({
        where: { user_id: user_id, status: 0 },
      });
      return res.status(200).json({ message: "Success", data: checkTrans });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllTransaction: async (req, res) => {
    try {
      const transAll = await trans.findAll({
        include: [
          {
            model: user,
          },
        ],
      });
      return res.status(200).json({ message: "Succeswes", data: transAll });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  cancelUserTransaction: async (req, res) => {
    try {
      const { transaction_id } = req.params;
      const findTransaction = await trans.findOne({
        where: { id: transaction_id },
      });
      const findTsItem = await Transactionitem.findAll({
        where: { transaction_id: findTransaction.id },
      });
      let product_idSold;
      let quantitySold;
      let quantityFinal = 0;

      for (const item of findTsItem) {
        product_idSold = item.product_id;
        quantitySold = item.quantity;

        const findProducs = await productStore.findOne({
          where: { product_id: product_idSold },
        });

        quantityFinal = findProducs.quantity + quantitySold;

        await db.sequelize.transaction(async (t) => {
          const result = await trans.update(
            { status: 5 },
            { where: { id: transaction_id } },
            { transaction: t }
          );
          const responsCart = await cart.update(
            { total_price: 0 },
            { where: { user_id: transaction_id } },
            { transaction: t }
          );
          const restoreProduct = await productStore.update(
            { quantity: quantityFinal, isactive: true },
            { where: { product_id: findProducs.product_id } }
          );

          await stockHistory.create(
            {
              product_id: findProducs.product_id,
              store_id: findProducs.store_id,
              quantity: quantityFinal,
              description: `Cancel Order ${quantitySold}`,
            },
            { transaction: t }
          );
        });
      }
      return res.status(200).json({ message: "Success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  confirmUserOrder: async (req, res) => {
    try {
      const { transaction_id } = req.params;
      const findTransaction = await trans.findOne({
        where: { id: transaction_id },
      });

      await db.sequelize.transaction(async (t) => {
        const result = await trans.update(
          { status: 2 },
          { where: { id: transaction_id } },
          { transaction: t }
        );
      });
      return res.status(200).json({ message: "AMAN" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  sendUserOrder: async (req, res) => {
    try {
      const { transaction_id } = req.params;
      const findTransaction = await trans.findOne({ where: { id: transaction_id } });

      await db.sequelize.transaction(async (t) => {
        const result = await trans.update(
          { status: 3 },
          { where: { id: transaction_id } },
          { transaction: t }
        );
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(
          twoDaysFromNow.getDate() + (findTransaction.duration || 2)
        );
        await trans.update(
          { expiredIn: twoDaysFromNow },
          { where: { id: transaction_id } },
          { transaction: t }
        );
      });
      return res.status(200).json({ message: "Status updated to 3" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  approveUserPayment: async (req, res) => {
    try {
      const { transaction_id } = req.params;
      const findTransaction = await trans.findOne({
        where: { id: transaction_id },
      });
      if (!findTransaction)
        return res.status(404).json({ message: "Transaction not found" });

      await db.sequelize.transaction(async (t) => {
        await trans.update(
          { status: 2 },
          { where: { id: transaction_id } },
          { transaction: t }
        );
        return res.status(200).json({ message: "Status updated to 2" });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  rejectUserPayment: async (req, res) => {
    try {
      const { transaction_id } = req.params;
      const { message } = req.body;
      const findTransaction = await trans.findOne({
        where: { id: transaction_id },
      });
      if (!findTransaction)
        return res.status(404).json({ message: "Transaction not found" });

      await db.sequelize.transaction(async (t) => {
        await trans.update(
          { message, status: 0 },
          { where: { id: transaction_id } },
          { transaction: t }
        );
        return res.status(200).json({ message: "Success" });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
const updateStatus = async (transaction_id) => {
  await db.sequelize.transaction(async (t) => {
    const result = await trans.update(
      { status: 4 },
      { where: { id: transaction_id } },
      { transaction: t }
    );
  });
};

module.exports = adminController;
