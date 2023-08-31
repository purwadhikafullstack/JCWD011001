"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Useraddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Useraddress.init(
    {
      user_id: DataTypes.INTEGER,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Useraddress",
    }
  );
  return Useraddress;
};
