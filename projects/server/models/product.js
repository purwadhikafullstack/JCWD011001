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
      // define association here
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
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
