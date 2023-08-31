"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voucherdetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Voucherdetail.init(
    {
      name: DataTypes.STRING,
      product_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      nominal: DataTypes.INTEGER,
      percent: DataTypes.INTEGER,
      cashback: DataTypes.ENUM("yes", "no"),
      buy1get1: DataTypes.ENUM("yes", "no"),
      discount: DataTypes.ENUM("yes", "no"),
      expired: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Voucherdetail",
    }
  );
  return Voucherdetail;
};
