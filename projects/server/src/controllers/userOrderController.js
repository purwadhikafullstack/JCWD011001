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
      return res
        .status(200)
        .json({ message: "Success", totalPage, data: transaction });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Get Transaction Failed", error: error.message });
    }
  },

  getUserTransactionItem: async (req, res) => {
    try {
      const { id } = req.params;

      const transactionData = await Transaction.findOne({
        where: { id },
        attributes: {
          exclude: ["voucher_discount", "city_id", "store_id", "updatedAt"],
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

      return res
        .status(200)
        .json({ message: "Get Transaction Success", data: transactionData });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Get Transaction Item Failed", error: error.message });
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

  getBranchUserTransaction: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        order = "DESC",
        orderBy = "id",
        startDate,
        endDate,
      } = req.query;

      const { store_id } = req.user;

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
        where: {
          ...filter,
          store_id: store_id,
        },
      });
      const totalPage = Math.ceil(totalTransaction / +limit);
      const transaction = await Transaction.findAll({
        where: {
          ...filter,
          store_id: store_id,
        },
        ...pagination,
        order: [[orderBy, order]],
      });
      console.log("inikah => ?", transaction)
      for (const transactions of transaction) {
        const expirationDate = new Date(transactions.dataValues.expiredIn);
        
        // Check if expirationDate is a valid date (not null and not "1970-01-01T00:00:00.000Z")
        if (!isNaN(expirationDate.getTime()) && expirationDate.getTime() !== 0) {
          console.log("expiredIn from database:", expirationDate);
          
          const currentDate = new Date();
          console.log("Current date:", currentDate);
          
          // Perform any other operations on this transaction here
          if(currentDate >= expirationDate && transactions.status === 3){
            await db.sequelize.transaction(async(t) => {
              const result = await Transaction.update({status : 4},{where : {id: transactions.id}}, {transaction : t})
            })
            console.log("berhasil")
          }
        }
      }
      return res
        .status(200)
        .json({ message: "Success", totalPage, data: transaction });
    } catch (error) {
      return res.status(500).json({ message: "Get Transaction Data Failed", error: error.message });
    }
  },

  getSalesData: async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 8);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const activeStores = await Store.findAll({
        where: {
          isActive: true,
        },
        attributes: ["id", "name"],
      });

      const storeNames = activeStores.reduce((acc, store) => {
        acc[store.id] = store.name;
        return acc;
      }, {});

      const results = await Transaction.findAll({
        attributes: [
          [Sequelize.fn("DATE", Sequelize.col("updatedAt")), "day"],
          [Sequelize.fn("SUM", Sequelize.col("total_price")), "total_sales"],
          "store_id",
        ],
        where: {
          status: 6,
          updatedAt: {
            [Op.between]: [sevenDaysAgo, today],
          },
          store_id: Object.keys(storeNames),
        },
        group: [Sequelize.fn("DATE", Sequelize.col("updatedAt")), "store_id"],
      });

      const formattedResults = results.map((result) => ({
        day: result.dataValues.day,
        total_sales: result.dataValues.total_sales,
        store_name: storeNames[result.dataValues.store_id],
      }));

      formattedResults.sort((a, b) => new Date(b.day) - new Date(a.day));

      const datesInRange = [];
      for (let i = 7; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);
        datesInRange.push(date.toISOString().split("T")[0]);
      }

      const groupedData = {};

      for (const date of datesInRange) {
        groupedData[date] = {};
        for (const storeId in storeNames) {
          groupedData[date][storeNames[storeId]] = 0;
        }
      }

      for (const result of formattedResults) {
        groupedData[result.day][result.store_name] = result.total_sales;
      }

      return res.status(200).json({ success: true, data: groupedData });
    } catch (error) {
      return res.status(500).json({
        message: "Get Sales Data Failed",
        error: error.message,
      });
    }
  },

  getBranchDailySales: async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 8);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { store_id } = req.user;

      const activeStore = await Store.findOne({
        where: {
          id: store_id,
          isactive: true,
        },
        attributes: ["id", "name"],
      });

      if (!activeStore) {
        return res.status(404).json({
          success: false,
          message: "Store not found or inactive.",
        });
      }

      const storeName = activeStore.name;

      const results = await Transaction.findAll({
        attributes: [
          [Sequelize.fn("DATE", Sequelize.col("updatedAt")), "day"],
          [Sequelize.fn("SUM", Sequelize.col("total_price")), "total_sales"],
          "store_id",
        ],
        where: {
          status: 6,
          updatedAt: {
            [Op.between]: [sevenDaysAgo, today],
          },
          store_id: store_id,
        },
        group: [Sequelize.fn("DATE", Sequelize.col("updatedAt")), "store_id"],
      });

      const datesInRange = [];
      const groupedData = {};

      for (let i = 7; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const formattedDate = date.toISOString().split("T")[0];
        datesInRange.push(formattedDate);
        groupedData[formattedDate] = {
          [storeName]: 0,
        };
      }

      for (const result of results) {
        const formattedDate = result.dataValues.day;
        groupedData[formattedDate][storeName] = result.dataValues.total_sales;
      }

      return res.status(200).json({ success: true, data: groupedData });
    } catch (error) {
      return res.status(500).json({
        message: "Get Branch Daily Sales Data Failed",
        error: error.message,
      });
    }
  },
};

module.exports = userOrderController;
