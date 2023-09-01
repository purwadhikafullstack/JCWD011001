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
    }
  }
  Transaction.init(
    {
      name: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      total_price: DataTypes.INTEGER,
      delivery_price: DataTypes.INTEGER,
      total_discount: DataTypes.INTEGER,
      address: DataTypes.STRING,
      cityname: DataTypes.STRING,
      postal_code: DataTypes.INTEGER,
      payment_method: DataTypes.ENUM("cash", "transfer", "QR"),
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
