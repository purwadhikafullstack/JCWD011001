"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Useraddress, { foreignKey: "user_id" });
      this.hasMany(models.Uservoucher, { foreignKey: "user_id" });
      this.hasMany(models.Transaction, { foreignKey: "user_id" });
      this.hasOne(models.Cart, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      name: DataTypes.STRING,
      birthdate: DataTypes.DATE,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      gender: DataTypes.STRING,
      profileimg: DataTypes.STRING,
      refcode: DataTypes.STRING,
      refby: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
