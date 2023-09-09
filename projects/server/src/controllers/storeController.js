const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const Store = db.Store;

const storeController = {
  cekStore: async (req, res) => {
    try {
      const { location } = req.query;
      console.log(req.body);
      const data = await Store.findOne({ where: { location: { [Op.like]: `%${location}%` } } });
      if (data) return res.status(200).json({ data });
      return res.status(404).json({ message: "Store not found" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = storeController;
