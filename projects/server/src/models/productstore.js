"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductStore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, { foreignKey: "product_id" });
      this.belongsTo(models.Store, { foreignKey: "store_id" });
    }
  }
  ProductStore.init(
    {
      product_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      isactive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "ProductStore",
    }
  );
  return ProductStore;
};
