const { Sequelize, where } = require("sequelize");
const db = require("../models");
const Op = Sequelize.Op;
const { sequelize, Transaction, Product, ProductStore, Transactionitem, User, Category, Store } = db;

const includeCategory = [{ model: Category, attributes: { exclude: ["createdAt", "updatedAt"] } }];
const includeProduct = [
  {
    model: Product,
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: { isactive: true },
    include: includeCategory,
  },
];

const setPagination = (limit, page) => {
  const offset = (page - 1) * +limit;
  return { limit: parseInt(limit), offset };
};

const reportController = {
  getReportTransaction: async (req, res) => {
    try {
      const { store_id } = req.params;
      const totalTransactions = await Transaction.sum("total_price", {
        where: { store_id, status: 6 },
      });
      const totalUserBuy = await Transaction.count({
        distinct: true,
        col: "user_id",
        where: { store_id, status: 6 },
      });
      const totalProductBuy = await Transaction.sum(
        "Transactionitems.quantity",
        {
          where: { store_id, status: 6 },
          include: [{ model: Transactionitem, attributes: [] }],
        }
      );
      const mostSoldProduct = await Transactionitem.findOne({
        attributes: [
          "product_id",
          [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantitySold"],
        ],
        where: {
          "$Transaction.store_id$": store_id,
          "$Transaction.status$": 6,
        },
        include: [{ model: Transaction, attributes: [] }, { model: Product }],
        group: ["product_id"],
        order: [[sequelize.literal("totalQuantitySold"), "DESC"]],
      });

      res.status(200).json({
        message: "Get Report Transaction Success",
        data: totalTransactions,
        totalUserBuy,
        totalProductBuy,
        mostSoldProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed", error: error.message });
    }
  },
  getUsersTransactionReportPerBranch: async (req, res) => {
    try {
      const { store_id } = req.params;
      const { order, orderBy = "user_id", startDate, endDate } = req.query;
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
      const userTransactions = await Transaction.findAll({
        attributes: [
          "user_id",
          [sequelize.fn("COUNT", sequelize.col("*")), "totalTransactions"],
          [sequelize.fn("SUM", sequelize.col("total_price")), "total_price"],
          [
            sequelize.fn("SUM", sequelize.col("total_discount")),
            "total_discount",
          ],
        ],
        where: {
          store_id,
          status: 6,
          ...filter,
        },
        group: ["user_id"],
        include: [{ model: User }],
        order: [[orderBy, order]],
      });
      res.status(200).json({ message: "Success", data: userTransactions });
    } catch (error) {
      res.status(500).json({ message: "Failed", error: error.message });
    }
  },
  getUserTransactionPerUserId: async (req, res) => {
    try {
      const { user_id, store_id } = req.params;
      const { startDate, endDate } = req.query;
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
      const userTransactions = await Transaction.findAll({
        where: { user_id, store_id, status: 6, ...filter },
      });
      res.status(200).json({ message: "Success", data: userTransactions });
    } catch (error) {
      res.status(500).json({ message: "Failed", error: error.message });
    }
  },

  getProductTransaction: async (req, res) => {
    try {
      const { store_id } = req.params;
      const { limit = 3, page = 1 } = req.query;
      const pagination = setPagination(limit, page);
      const totalProduct = await ProductStore.count({ where: { store_id } });
      const totalPage = Math.ceil(totalProduct / +limit);
      const StoreProduct = await ProductStore.findAll({
        where: { store_id },
        include: includeProduct,
        ...pagination,
      });
      res
        .status(200)
        .json({ message: "Success", totalPage, data: StoreProduct });
    } catch (error) {
      res.status(500).json({ message: "Failed", error: error.message });
    }
  },
  getProductTransactionPerId: async (req, res) => {
    console.log("param", req.params);
    try {
      const { store_id, product_id } = req.params;
      const { startDate = "1970-01-01", endDate = new Date() } = req.query;
      const SoldProduct = await Transactionitem.findOne({
        attributes: [
          "product_id",
          [sequelize.fn("SUM", sequelize.col("quantity")), "totalProductSold"],
        ],
        where: {
          "$Transaction.store_id$": store_id,
          "$Transaction.status$": 6,
          product_id,
        },
        include: [{ model: Transaction, attributes: [] }],
        group: ["product_id"],
        order: [[sequelize.literal("totalProductSold"), "DESC"]],
      });
      const SoldProductsByMonth = await Transactionitem.findAll({
        attributes: [
          [
            sequelize.literal('DATE_FORMAT(Transaction.createdAt, "%Y-%m")'),
            "month",
          ],
          [sequelize.fn("SUM", sequelize.col("quantity")), "totalProductSold"],
        ],
        where: {
          "$Transaction.store_id$": store_id,
          "$Transaction.status$": 6,
          product_id,
          "$Transaction.createdAt$": {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: Transaction,
            attributes: [],
            where: {
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
        group: ["month"],
        order: [[sequelize.literal("month"), "DESC"]],
      });

      res
        .status(200)
        .json({
          message: "Success",
          data: SoldProduct,
          month: SoldProductsByMonth,
        });
    } catch (error) {
      res.status(500).json({ message: "Failed", error: error.message });
    }
  },
  getReportTransactionStatusAll: async (req, res) => {
    try {
      const { store_id } = req.params;
      const {
        order,
        orderBy = "createdAt",
        startDate,
        endDate,
        page = 1,
        limit = 4,
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
      const pagination = setPagination(limit, page);
      const totalTransaction = await Transaction.count({
        where: { store_id, ...filter },
      });
      const totalPage = Math.ceil(totalTransaction / +limit);
      const totalTransactions = await Transaction.findAll({
        where: { store_id, ...filter },
        order: [[orderBy, order]],
        ...pagination,
      });
      res
        .status(200)
        .json({ message: "Success", totalPage, data: totalTransactions });
    } catch (error) {
      res.status(500).json({ message: "Failed", error: error.message });
    }
  },
  getStoreBranchId: async (req, res) => {
    try {
      const { store_id } = req.user;
      const data = await Store.findOne({ where: { id: store_id } });
      return res.status(200).json({ message: "Success", data: data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllReportTransaction: async (req, res) => {
    try {
      const totalTransactions = await Transaction.sum("total_price", {
        where: { status: 6 },
      });
      const totalUserBuy = await Transaction.count({
        distinct: true,
        col: "user_id",
        where: { status: 6 },
      });
      const totalProductBuy = await Transaction.sum(
        "Transactionitems.quantity",
        {
          where: { status: 6 },
          include: [{ model: Transactionitem, attributes: [] }],
        }
      );
      const mostSoldProduct = await Transactionitem.findOne({
        attributes: [
          "product_id",
          [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantitySold"],
        ],
        where: {
          "$Transaction.status$": 6,
        },
        include: [{ model: Transaction, attributes: [] }, { model: Product }],
        group: ["product_id"],
        order: [[sequelize.literal("totalQuantitySold"), "DESC"]],
      });

      res.status(200).json({
        message: "Get Report Transaction Success",
        data: totalTransactions,
        totalUserBuy,
        totalProductBuy,
        mostSoldProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed", error: error.message });
    }
  },
};

module.exports = reportController;
