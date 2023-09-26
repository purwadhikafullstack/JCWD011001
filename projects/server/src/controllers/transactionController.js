const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { Transaction, Product, Transactionitem, Cart, Cartitem } = db;

const setPagination = (limit, page) => {
  const offset = (page - 1) * +limit;
  return { limit: parseInt(limit), offset };
};

const transactionController = {
  getTransaction: async (req, res) => {
    try {
      const { page = 1, limit = 3, order = "DESC", orderBy = "id", startDate, endDate } = req.query;
      let filter = {};
      if (startDate) filter.createdAt = { [Op.gte]: new Date(startDate) };
      if (endDate) filter.createdAt = { [Op.lte]: new Date(endDate).setHours(23, 59, 59) };
      if (startDate && endDate) {
        filter = {
          createdAt: { [Op.between]: [new Date(startDate), new Date(endDate).setHours(23, 59, 59)] },
        };
      }

      const pagination = setPagination(limit, page);
      const totalTransaction = await Transaction.count({
        where: {
          user_id: req.user.id,
          status: { [Op.lt]: 5 },
          ...filter,
        },
      });
      const totalPage = Math.ceil(totalTransaction / +limit);
      console.log("order", orderBy);
      const transaction = await Transaction.findAll({
        where: {
          user_id: req.user.id,
          status: {
            [Op.lt]: 5,
          },
          ...filter,
        },
        ...pagination,
        order: [[orderBy, order]],
      });
      res.status(200).json({ message: "Get Transaction Success", totalPage, data: transaction });
    } catch (error) {
      res.status(500).json({ message: "Get Transaction Failed", error: error.message });
    }
  },
  getFinishedTransaction: async (req, res) => {
    try {
      const { page = 1, limit = 3, order = "ASC", orderBy = "name", startDate, endDate } = req.query;

      let filter = {};
      if (startDate) filter.createdAt = { [Op.gte]: new Date(startDate) };
      if (endDate) filter.createdAt = { [Op.lte]: new Date(endDate).setHours(23, 59, 59) };
      if (startDate && endDate) {
        filter = { createdAt: { [Op.between]: [new Date(startDate), new Date(endDate).setHours(23, 59, 59)] } };
      }

      const pagination = setPagination(limit, page);
      const totalTransaction = await Transaction.count({
        where: {
          user_id: req.user.id,
          status: { [Op.gte]: 5 },
          ...filter,
        },
      });
      const totalPage = Math.ceil(totalTransaction / +limit);

      const transaction = await Transaction.findAll({
        where: {
          user_id: req.user.id,
          status: { [Op.gte]: 5 },
          ...filter,
        },
        ...pagination,
        order: [[orderBy, order]],
      });
      res.status(200).json({ message: "Get Transaction Success", totalPage, data: transaction });
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
  checkout: async (req, res) => {
    try {
      const { id } = req.user;
      const cart = await Cart.findOne({ where: { user_id: id } });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const cartItems = await Cartitem.findAll({ where: { cart_id: cart.id } });

      const {
        name,
        total_price,
        delivery_price,
        address,
        city_id,
        store_id,
        voucher_discount,
        courier,
      } = req.body;

      let total_discount = 0;
      for (const cartItem of cartItems) {
        const product = await Product.findByPk(cartItem.product_id);
        total_discount += product.admin_discount;
      }

      // Tambahkan voucher_discount ke total_discount
      total_discount += voucher_discount;

      const newTransaction = await Transaction.create({
        user_id: id,
        name,
        total_price,
        delivery_price,
        total_discount, // Gunakan total_discount yang sudah diperbarui
        address,
        city_id,
        store_id,
        courier,
        status: 0,
      });

      for (const cartItem of cartItems) {
        const product = await Product.findByPk(cartItem.product_id);

        await Transactionitem.create({
          transaction_id: newTransaction.id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          admin_discount: product.admin_discount,
          voucher_discount,
          price: product.price,
        });
      }

      // Hitung total harga, dll. untuk transaksi dan simpan di dalam newTransaction

      await Cartitem.destroy({ where: { cart_id: cart.id } });

      return res
        .status(200)
        .json({ message: "Checkout successful", transaction: newTransaction });
    } catch (error) {
      return res.status(500).json({ message: "Failed", error: error.message });
    }
  }
};

module.exports = transactionController;
