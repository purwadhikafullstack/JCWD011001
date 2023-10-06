const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { Transaction, Product, Transactionitem, Store, User } = db;

const setPagination = (limit, page) => {
  const offset = (page - 1) * +limit;
  return { limit: parseInt(limit), offset };
};

const userOrderController = {
  getAllUserTransaction: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        order = "DESC",
        orderBy = "id",
        startDate,
        endDate,
        storeId,
      } = req.query;
      let filter = {};
      if (startDate) filter.createdAt = { [Op.gte]: new Date(startDate) };
      if (endDate)
        filter.createdAt = { [Op.lte]: new Date(endDate).setHours(23, 59, 59) };
      if (startDate && endDate) {
        filter = {
          createdAt: {
            [Op.between]: [
              new Date(startDate),
              new Date(endDate).setHours(23, 59, 59),
            ],
          },
        };
      }
      if (storeId) {
        filter.store_id = storeId;
      }

      const pagination = setPagination(limit, page);
      const totalTransaction = await Transaction.count({
        where: {
          ...filter,
        },
      });
      const totalPage = Math.ceil(totalTransaction / +limit);
      const transaction = await Transaction.findAll({
        where: {
          ...filter,
        },
        ...pagination,
        order: [[orderBy, order]],
      });
      return res.status(200).json({ message: "Success", totalPage, data: transaction });
    } catch (error) {
      return res.status(500).json({ message: "Get Transaction Failed", error: error.message });
    }
  },

  getUserTransactionItem: async (req, res) => {
    try {
      const { id } = req.params;

      const transactionData = await Transaction.findOne({
        where: { id },
        attributes: {
          exclude: [
            "voucher_discount",
            "city_id",
            "store_id",
            "updatedAt",
          ],
        },
        include: [
          {
            model: Transactionitem,
            where: { transaction_id: id },
            attributes: {
              exclude: [
                "product_id",
                "transaction_id",
                "admin_discount",
                "price",
                "createdAt",
                "updatedAt",
              ],
            },
            include: [
              {
                model: Product,
                attributes: {
                  exclude: [
                    "category_id",
                    "store_id",
                    "isactive",
                    "createdAt",
                    "updatedAt",
                  ],
                },
              },
            ],
          },
          {
            model: Store,
            attributes: ["id", "name"],
          },
          {
            model: User,
            attributes: ["id", "phone"],
            where: { id: Sequelize.col("Transaction.user_id") },
          },
        ],
      });

      if (!transactionData) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      return res.status(200).json({ message: "Get Transaction Success", data: transactionData });
    } catch (error) {
      return res.status(500).json({ message: "Get Transaction Item Failed", error: error.message });
    }
  },

  getStoreData: async (req, res) => {
    try {
        const stores = await Store.findAll({
          where: {
            isActive: true,
          },
          attributes: {
            exclude: ["isactive", "createdAt", "updatedAt"],
          },
        });
        return res.status(200).json({ message: "Get Store Data Successful", stores });
    } catch (error) {
        return res.status(500).json({ message: "Get Store Data Failed", error: error.message });
    }
  },
};

module.exports = userOrderController;
