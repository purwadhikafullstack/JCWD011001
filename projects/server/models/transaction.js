"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Transactionitem, { foreignKey: "transaction_id" });
      this.hasMany(models.Uservoucher, { foreignKey: "transaction_id" });
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.belongsTo(models.Store, { foreignKey: "store_id" });
    }
  }
  Transaction.init(
    {
      name: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      total_price: DataTypes.INTEGER,
      delivery_price: DataTypes.INTEGER,
      total_discount: DataTypes.INTEGER,
      voucher_discount: DataTypes.INTEGER,
      address: DataTypes.STRING,
      city_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      courier: DataTypes.STRING,
      transaction_img: DataTypes.STRING,
      payment_method: DataTypes.ENUM("cash", "transfer", "QR"),
      status: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
