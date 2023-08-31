"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cartitem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Cart, { foreignKey: "cart_id" });
      this.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  Cartitem.init(
    {
      name: DataTypes.STRING,
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      cart_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cartitem",
    }
  );
  return Cartitem;
};
