const db = require("../../models");
const { Sequelize, Op, where } = require("sequelize");
const Admin = db.Admin;
const Store = db.Store;
const productStore = db.ProductStore
const stockHistory = db.Storestockhistory
const trans = db.Transaction;
const user = db.User;
const { Product, Category } = db;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const KEY = process.env.KEY;
const axios = require("axios");

let includeStore = [{ model: Store, attributes: { exclude: ["createdAt", "updatedAt"] }, where: { isactive: true } }];
const includeCategory = [{ model: Category, attributes: { exclude: ["createdAt", "updatedAt"] } }];
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
        attributes: { exclude: ["admin_id", "longitude", "latitude", "createdAt", "updatedAt", "isactive"] },
      });
      if(!checkLogin || !checkBranch) {
        return res.status(404).json({ message: "Branch admin not found" });
      }

      if (!checkLogin.isactive) {
        return res.status(401).json({ message: "Admin is not active" });
      }

      const passwordValid = await bcrypt.compare(password, checkLogin.password);
      if (!passwordValid) return res.status(404).json({ message: "Incorrect password" });

      checkLogin.store_id = checkBranch.id;

      let payload = {
        id: checkLogin.id,
        name: checkLogin.name,
        email: checkLogin.email,
        role: checkLogin.role_id,
      };

      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "24h",
      });

      return res.status(200).json({ message: "Login success", Account: checkLogin, BranchData: checkBranch, token: token });
    } catch (error) {
      return res.status(500).json({ message: "Login failed", error: error.message });
    }
  },

  createBranchAdmin: async (req, res) => {
    try {
      const { name, email, branch, password, confirmPassword, city_id } = req.body;
      const findAdmin = await Admin.findOne({
        where: { [Sequelize.Op.or]: [{ name }, { email }, {}] },
      });
      if (findAdmin) return res.status(400).json({ message: "Name or Email already exists" });

      const branchAdminExist = await Store.findOne({
        where: { location: branch, isactive: true },
      });

      if (branchAdminExist?.admin_id > 1) {
        return res.status(400).json({ message: "Admin in this branch already exists" });
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

  // getAdminsById: async (req, res) => {
  //   try {
  //     const { id } = req.params.id;
  //     const admin = await Admin.findOne({ where: { id: id } });
  //     return res.status(200).json({ message: "Admin retrieved successfully", data: admin });
  //   } catch (error) {
  //     return res.status(500).json({ message: "Failed to retrieve admin", error: error.message });
  //   }
  // },

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
      return res.status(500).json({ message: "Failed to delete admin", error: error.message });
    }
  },

 fetchProduct : async (req, res) => {
    try {
      const {
        page = 1,
        limit = 5,
        order = 'ASC',
        orderBy = 'name',
        category = '', // This should correspond to a valid category ID
        name = '',
        minPrice = 0,
        maxPrice = Infinity,
      } = req.query;
  
      const findName = { name: { [Op.like]: `%${name || ""}%` } };
      const pagination = { offset: (page - 1) * limit, limit: +limit };
      const totalProduct = await Product.count();
      const totalPage = Math.ceil(totalProduct / +limit);
      const where = {};
  
      if (category) {
        where.category_id = category;
      }
  
      let orderByColumn;
      if (orderBy === 'price') {
        orderByColumn = Sequelize.literal('price'); // Sort by price
      } else {
        orderByColumn = Sequelize.col(orderBy); // Sort by other columns
      }
  
      const products = await Product.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'category_id'],
        },
        include: [{ model: Category, as: 'Category' }], // Make sure this is set up correctly
        ...pagination,
        where: { ...findName, ...where },
        order: [[orderByColumn, order]],
      });
  
      res.status(200).json({ page, totalProduct, totalPage, limit, data: products });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteProduct : async (req, res) => {
    try {
      const {productId} = req.params
      console.log("id destroy", productId)
      const checkProduct = await Product.findOne({where : {id: productId}})
      console.log("id product destroy", checkProduct)
      await db.sequelize.transaction(async (t) => {
        const response = await Product.destroy({where : {id : productId}}, {transaction : t})
      })
      return res.status(200).json({message : "Success"})
    } catch (error) {
      return res.status(500).json({message : error.message})
    }
  },
  updateStock: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const store = await Store.findOne({ where: { admin_id: req.user.id } });
      if (!store) {
        return res.status(404).json({ message: "Store not found for the user." });
      }
      const existingProductStore = await productStore.findOne({
        where: { product_id: productId, store_id: store.id },
      });
      console.log("existing product", existingProductStore)
      const existingStoresHistory = await stockHistory.findOne({
        where: { product_id: productId, store_id: store.id },
      });
      console.log("update sampai sini", existingStoresHistory)
      if (existingProductStore) {
        existingProductStore.quantity = quantity;
        existingStoresHistory.quantity = quantity
        await existingProductStore.save();
        await existingStoresHistory.save()
        return res.status(200).json({ message: "Update Success" });
      } else {
        await productStore.create({
          product_id: productId,
          store_id: store.id,
          quantity: quantity,
          isactive: true,
        });
        await stockHistory.create({
          product_id: productId,
          store_id: store.id,
          quantity: quantity,
          isactive: true,
        })
        return res.status(200).json({ message: "Create Success" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deActiveProductBranch : async (req, res) => {
    try {
      const {id} = req.params
      const findProduct = await productStore.findOne({where : {id}})
      console.log("deActive product branch", findProduct)
      await db.sequelize.transaction(async(t) => {
        await productStore.update({
          isactive : false
        }, {where : {id}}, {transaction : t})
      })
      return res.status(200).json({message : "Success"})
    } catch (error) {
      return res.status(500).json({message : error.message})
    }
  },
  enableProductBranch:async(req,res) => {
    try {
      const {id} = req.params;
      const findProduct = await productStore.findOne({where : {id}})
      console.log("enable,", findProduct)
      await db.sequelize.transaction(async(t) => {
        await productStore.update({
          isactive : true
        }, {where : {id}}, {transaction : t})
      })
      return res.status(200).json({message : "Enable Success"})
    } catch (error) {
      
    }


  },
  getStockBranch: async(req,res) => {
    try {
      const store = await Store.findOne({ where: { admin_id: req.user.id } });
      if (!store) {
        return res.status(404).json({ message: "Store not found for the user." });
      }
      console.log("store get ", store)
      console.log("admin store get", store.admin_id);
      const findBranch = await productStore.findAll({
        where : {
          store_id : store.id
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'category_id'],
        },
        include: [
          {
            model: Product,
            attributes: ['name', 'product_img', 'price', 'admin_discount']
          },
        ],
      })
      return res.status(200).json({message : "Success", data : findBranch})
    } catch (error) {
      return res.status(500).json({message : error.message})
    }
  },
  getUsers : async(req, res) => {
    try {
      const {id} = req.params
      const checkUser = await user.findAll({
        attributes : {
          exclude : ['createdAt', 'updatedAt']
        }
      })
      console.log("checkUser ", checkUser)
      return res.status(200).json({message : "Success", data : checkUser})
    } catch (error) {
      return res.status(500).json({message : error.message})
    }
  },
  getUserTransaction : async(req, res) => {
    try {
      const {user_id} = req.params
      const checkTrans = await trans.findOne({where : {user_id : user_id, status : 0}})
      console.log("checkUser ", checkTrans)
      return res.status(200).json({message : "Success", data : checkTrans})
    } catch (error) {
      return res.status(500).json({message : error.message})
    }
  },
  cancelUserTransaction : async (req, res) => {
    try {
      // const 
    } catch (error) {
      return res.status(500).json({message : error.message})
    }
  }

    
  

};

module.exports = adminController;