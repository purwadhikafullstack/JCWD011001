const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { Transaction, Product, Transactionitem } = db;

const transactionController = {
  getTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findAll({
        where: {
          user_id: req.user.id,
          status: {
            [Op.lt]: 5,
          },
        },
      });
      console.log("transaction", transaction);
      res.status(200).json({ message: "Get Transaction Success", data: transaction });
    } catch (error) {
      res.status(500).json({ message: "Get Transaction Failed", error: error.message });
    }
  },
  getFinishedTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findAll({
        where: {
          user_id: req.user.id,
          status: {
            [Op.gte]: 5,
          },
        },
      });
      console.log("transaction", transaction);
      res.status(200).json({ message: "Get Transaction Success", data: transaction });
    } catch (error) {
      res.status(500).json({ message: "Get Transaction Failed", error: error.message });
    }
  },

  getTransactionItemOne: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Transactionitem.findAll({ where: { transaction_id: id }, include: Product });
      res.status(200).json({ message: "Get Transaction Success", data: item });
    } catch (error) {
      res.status(500).json({ message: "Get Transaction Item Failed", error: error.message });
    }
  },
};

module.exports = transactionController;
