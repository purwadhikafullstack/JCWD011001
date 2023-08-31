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
    }
  }
  Uservoucher.init(
    {
      user_id: DataTypes.INTEGER,
      voucherdetail_id: DataTypes.INTEGER,
      isused: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Uservoucher",
    }
  );
  return Uservoucher;
};
