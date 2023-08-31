"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // has
      this.hasMany(models.ProductStore, { foreignKey: "product_id" });
      this.hasMany(models.Cartitem, { foreignKey: "product_id" });
      this.hasMany(models.Transactionitem, { foreignKey: "product_id" });
      this.hasMany(models.Voucherdetail, { foreignKey: "product_id" });
      //belongs
      this.belongsTo(models.Category, { foreignKey: "category_id" });
      this.belongsTo(models.Store, { foreignKey: "store_id" });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      admin_discount: DataTypes.INTEGER,
      product_img: DataTypes.STRING,
      isactive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
