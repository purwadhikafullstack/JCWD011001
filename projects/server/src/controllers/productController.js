const { Sequelize } = require("sequelize");
const db = require("../../models");
const { Product, Category, Store, ProductStore } = db;

const includeStore = [{ model: Store, attributes: { exclude: ["createdAt", "updatedAt"] } }];
const includeCategory = [{ model: Category, attributes: { exclude: ["createdAt", "updatedAt"] } }];
const includeProductStore = [
  { model: Product, attributes: { exclude: ["createdAt", "updatedAt"] }, include: includeCategory },
];

const setPagination = (limit, page) => {
  const offset = (page - 1) * +limit;
  return { limit: parseInt(limit), offset };
};

const productController = {
  getProduct: async (req, res) => {
    try {
      const { page = 1, limit = 8 } = req.query;

      const pagination = setPagination(limit, page);
      const totalProduct = await Product.count();
      const totalPage = Math.ceil(totalProduct / +limit);

      const products = await Product.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "category_id"],
        },
        include: includeCategory,
        ...pagination,
      });
      res.status(200).json({ page, totalPage, data: products });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getProductStore: async (req, res) => {
    try {
      const { store_id, page = 1, limit = 8 } = req.query;

      const pagination = setPagination(limit, page);
      const totalProduct = await ProductStore.count({ where: { store_id } });
      const totalPage = Math.ceil(totalProduct / +limit);

      const storeProducts = await ProductStore.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "product_id", "store_id"],
        },
        where: { store_id },
        include: [...includeProductStore, ...includeStore],
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
        include: [...includeProductStore, ...includeStore],
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
        include: [...includeProductStore, ...includeStore],
      });
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = productController;
