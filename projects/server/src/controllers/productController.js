const { Sequelize } = require("sequelize");
const db = require("../../models");
const { check } = require("express-validator");
const { Product, Category, Store, ProductStore } = db;
const cartItem = db.Cartitem;
const fs = require("fs").promises;
const path = require("path");

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

const productController = {
  getProduct: async (req, res) => {
    try {
      const { page = 1, limit = 4, order = "ASC", orderBy = "name", category = "" } = req.query;

      const where = { isactive: true };
      if (category) where.category_id = category;
      const pagination = setPagination(limit, page);
      const totalProduct = await Product.count(where);
      const totalPage = Math.ceil(totalProduct / +limit);
      const products = await Product.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "category_id"],
        },
        where,
        include: includeCategory,
        ...pagination,
        order: [[orderBy, order]],
      });
      res.status(200).json({ page, totalPage, data: products });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getProductStore: async (req, res) => {
    try {
      const {
        store_id,
        page = 1,
        limit = 9,
        order = "ASC",
        orderBy = "name",
        category = "",
      } = req.query;

      const includeProduct = [
        {
          model: Product,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { isactive: true },
          include: includeCategory,
        },
      ];
      const pagination = setPagination(limit, page);
      const totalProduct = await ProductStore.count({
        where: { store_id, isactive: true },
        include: includeProduct,
      });
      const totalPage = Math.ceil(totalProduct / +limit);

      if (category) includeProduct[0].where.category_id = category;

      const storeProducts = await ProductStore.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "product_id", "store_id"],
        },
        where: { store_id, isactive: true },
        include: [...includeProduct, ...includeStore],
        order: [[{ model: Product }, orderBy, order]],
        ...pagination,
      });
      res.status(200).json({ page, totalPage, data: storeProducts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getProductDetail: async (req, res) => {
    try {
      const { id } = req.query;
      const product = await Product.findOne({
        where: { id, isactive: true },
        attributes: {
          exclude: ["createdAt", "updatedAt", "category_id"],
        },
        include: includeCategory,
      });
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProductStock: async (req, res) => {
    try {
      const { id, store_id } = req.query;
      if (!store_id) return productController.getProductDetail(req, res);
      const product = await ProductStore.findOne({
        where: { store_id, product_id: id, isactive: true },
        attributes: {
          exclude: ["createdAt", "updatedAt", "product_id", "store_id"],
        },
        include: [...includeProduct, ...includeStore],
      });
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getStoreProductEachBranch: async (req, res) => {
    try {
      const { id } = req.query;
      const product = await ProductStore.findAll({
        where: { product_id: id, isactive: true },
        attributes: {
          exclude: ["createdAt", "updatedAt", "product_id", "store_id"],
        },
        include: [...includeProduct, ...includeStore],
      });
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getSearchProduct: async (req, res) => {
    try {
      const { name, category_id, store_id } = req.query;

      const where = { isactive: true };
      if (name) where.name = { [db.Sequelize.Op.like]: `%${name}%` };
      if (category_id) where.category_id = category_id;
      if (store_id) {
        const id = await ProductStore.findAll({
          where: { store_id, isactive: true },
          attributes: ["product_id"],
        });
        where.id = { [db.Sequelize.Op.in]: id.map((item) => item.product_id) };
      }
      const product = await Product.findAll({ where, include: Category });
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getProductDetail: async (req, res) => {
    try {
      const { id } = req.query;
      const product = await Product.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "category_id"],
        },
        include: includeCategory,
      });
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProductStock: async (req, res) => {
    try {
      const { id, store_id } = req.query;
      if (!store_id) return productController.getProductDetail(req, res);
      const product = await ProductStore.findOne({
        where: { store_id, product_id: id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "product_id", "store_id"],
        },
        include: [...includeProduct, ...includeStore],
      });
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getStoreProduct: async (req, res) => {
    try {
      const { id } = req.query;
      const product = await ProductStore.findAll({
        where: { product_id: id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "product_id", "store_id"],
        },
        include: [...includeProduct, ...includeStore],
      });
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const { name, category_id, price, admin_discount, description, weight } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "Product image is required" });
      }
      const productExist = await Product.findOne({
        where: { name, isactive: true },
      });

      if (productExist) {
        return res.status(400).json({ message: "Product already exists" });
      }
      await db.sequelize.transaction(async (t) => {
        await Product.create(
          {
            name,
            category_id,
            price,
            admin_discount,
            product_img: req.file.path,
            isactive: true,
            description,
            weight,
          },
          { transaction: t }
        );
      });

      return res.status(200).json({ message: "Product added" });
    } catch (error) {
      console.error("Error creating product:", error);
      return res
        .status(500)
        .json({ message: "Failed to create product", error: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      let { newName, category_id, price, admin_discount, description, weight } =
        req.body;
      const findProduct = await Product.findOne({ where: { id } });
      if (newName === findProduct.name) {
        return res.status(500).json({ message: "Product name already exist" });
      }
      await db.sequelize.transaction(async (t) => {
        await Product.update(
          {
            name: newName,
            category_id,
            price,
            admin_discount,
            description,
            weight,
          },
          { where: { id } },
          { transaction: t }
        );
        return res.status(200).json({ message: "Product updated" });
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed", error: error.message });
    }
  },
  changeProductPicture: async (req, res) => {
    try {
      const { id } = req.params;
      const oldPicture = await Product.findOne({ where: { id } });
      if (oldPicture.product_img) {
        fs.unlink(path.resolve(__dirname, `../../${oldPicture.product_img}`), (err) => {
          return res.status(500).json({ message: err.message });
        });
      }
      await db.sequelize.transaction(async (t) => {
        await Product.update(
          {
            product_img: req.file.path,
          },
          { where: { id } },
          { transaction: t }
        );
      });
      return res.status(200).json({ message: "Product's Picture Change" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const findProduct = await Product.findOne({ where: { id } });
      await db.sequelize.transaction(async (t) => {
        await Product.update(
          {
            isactive: false,
          },
          { where: { id } },
          { transaction: t }
        );
        return res.status(200).json({ message: "Product deleted" });
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed", error: error.message });
    }
  },
  activeProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const findProduct = await Product.findOne({ where: { id } });
      await db.sequelize.transaction(async (t) => {
        await Product.update(
          {
            isactive: true,
          },
          { where: { id } },
          { transaction: t }
        );
        return res.status(200).json({ message: "Product active" });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getItemDetail: async (req, res) => {
    try {
      const { id, store_id } = req.params;
      const cekItem = await cartItem.findOne({
        where: { product_id: id, store_id },
      });
      const cekProduct = await ProductStore.findOne({
        where: { product_id: id, store_id },
      });
      return res
        .status(200)
        .json({
          message: "Successsss",
          Item: cekItem,
          ProductBranch: cekProduct,
        });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = productController;
