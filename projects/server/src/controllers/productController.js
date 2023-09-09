const { Sequelize } = require("sequelize");
const db = require("../../models");
const Product = db.Product;
const Store = db.Store;
const ProductStore = db.ProductStore;

const includeProductStore = [{ model: Product, attributes: { exclude: ["createdAt", "updatedAt"] } }];

const includeStore = [{ model: Store, attributes: { exclude: ["createdAt", "updatedAt"] } }];

const productController = {
  getProduct: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.status(200).json({ data: products });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getProductStore: async (req, res) => {
    try {
      const { store_id } = req.query;
      console.log(store_id);
      const storeProducts = await ProductStore.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "product_id", "store_id"],
        },
        where: { store_id },
        include: [...includeProductStore, ...includeStore],
      });
      res.status(200).json({ data: storeProducts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = productController;
