"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Uservoucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.belongsTo(models.Voucherdetail, { foreignKey: "voucherdetail_id" });
      this.belongsTo(models.Transaction, { foreignKey: "transaction_id" });
    }
  }
  Uservoucher.init(
    {
      user_id: DataTypes.INTEGER,
      voucherdetail_id: DataTypes.INTEGER,
      transaction_id: DataTypes.INTEGER,
      isused: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Uservoucher",
    }
  );
  return Uservoucher;
};
