"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Storestockhistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Store, { foreignKey: "store_id" });
      this.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  Storestockhistory.init(
    {
      product_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Storestockhistory",
    }
  );
  return Storestockhistory;
};
