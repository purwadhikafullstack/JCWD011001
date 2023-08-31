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
      this.hasMany(models.Uservoucher, { foreignKey: "voucherdetail_id" });
      this.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  Voucherdetail.init(
    {
      name: DataTypes.STRING,
      product_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      nominal: DataTypes.INTEGER,
      percent: DataTypes.INTEGER,
      type: DataTypes.ENUM("cashback", "discount", "buy1get1"),
      expired: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Voucherdetail",
    }
  );
  return Voucherdetail;
};
