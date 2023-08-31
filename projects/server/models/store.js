"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Admin, { foreignKey: "admin_id" });
      this.hasMany(models.ProductStore, { foreignKey: "store_id" });
    }
  } 
  Store.init(
    {
      name: DataTypes.STRING,
      location: DataTypes.STRING,
      admin_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
