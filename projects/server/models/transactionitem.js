"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transactionitem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Transaction, { foreignKey: "transaction_id" });
      this.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  Transactionitem.init(
    {
      transaction_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      admin_discount: DataTypes.INTEGER,
      voucher_discount: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transactionitem",
    }
  );
  return Transactionitem;
};
