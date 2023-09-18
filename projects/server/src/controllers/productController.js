const { Sequelize } = require("sequelize");
const db = require("../../models");
const { check } = require("express-validator");
const { Product, Category, Store, ProductStore } = db;

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

const productController = {
  getProduct: async (req, res) => {
    try {
      const { page = 1, limit = 8, order = "ASC", orderBy = "name", category = "" } = req.query;

      const pagination = setPagination(limit, page);
      const totalProduct = await Product.count();
      const totalPage = Math.ceil(totalProduct / +limit);
      const where = { isactive: true };
      if (category) where.category_id = category;
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
      const { store_id, page = 1, limit = 8, order = "ASC", orderBy = "name", category = "" } = req.query;

      const pagination = setPagination(limit, page);
      const totalProduct = await ProductStore.count({ where: { store_id } });
      const totalPage = Math.ceil(totalProduct / +limit);

      const includeProduct = [
        {
          model: Product,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { isactive: true },
          include: includeCategory,
        },
      ];

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
};

module.exports = productController;
