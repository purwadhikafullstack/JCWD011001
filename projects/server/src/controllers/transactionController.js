const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const {
  Transaction,
  Product,
  ProductStore,
  Transactionitem,
  Cart,
  Cartitem,
  Voucherdetail,
  Uservoucher,
} = db;

const createFreeShippingVoucher = async (userId) => {
  try {
    const successfulTransactionsCount = await Transaction.count({
      where: {
        user_id: userId,
        status: {
          [Op.gte]: 5,
        },
      },
    });
    if (
      successfulTransactionsCount % 5 === 0 &&
      successfulTransactionsCount > 0
    ) {
      const existingVoucher = await Uservoucher.findOne({
        where: {
          user_id: userId,
          isused: false,
        },
        include: Voucherdetail,
      });

      if (!existingVoucher) {
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        const newVoucher = await Voucherdetail.create({
          name: "Free Delivery Voucher",
          description: "Free delivery voucher after your five successful transactions",
          nominal: 0,
          percent: 100,
          type: "freedelivery",
          expired: sevenDaysFromNow,
        });

        await Uservoucher.create({
          user_id: userId,
          voucherdetail_id: newVoucher.id,
          isused: false,
        });

        console.log("Free Shipping Voucher created for user:", userId);
      }
    }
  } catch (error) {
    console.error("Failed to create Free Shipping Voucher:", error);
  }
};

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
      res
        .status(500)
        .json({ message: "Get Transaction Failed", error: error.message });
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
      res
        .status(500)
        .json({ message: "Get Transaction Failed", error: error.message });
    }
  },

  getTransactionItemOne: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Transactionitem.findAll({
        where: { transaction_id: id },
        include: Product,
      });
      res.status(200).json({ message: "Get Transaction Success", data: item });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Get Transaction Item Failed", error: error.message });
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
        voucher_id,
        delivery_voucher_id,
        courier,
      } = req.body;

      let total_discount = 0;
      for (const cartItem of cartItems) {
        const product = await Product.findByPk(cartItem.product_id);
        total_discount += product.admin_discount;
      }

      total_discount += voucher_discount;

      const newTransaction = await Transaction.create({
        user_id: id,
        name,
        total_price,
        delivery_price,
        total_discount,
        voucher_discount,
        address,
        city_id,
        store_id,
        courier,
        status: 0,
      });

      const voucherIds = [];
      if (voucher_id) {
        voucherIds.push(voucher_id);
      }
      if (delivery_voucher_id) {
        voucherIds.push(delivery_voucher_id);
      }

      for (const cartItem of cartItems) {
        const product = await Product.findByPk(cartItem.product_id);

        const productStore = await ProductStore.findOne({
          where: {
            product_id: cartItem.product_id,
            store_id: store_id,
          },
        })

        await productStore.update({
          quantity: productStore.quantity - cartItem.quantity
        });
        await productStore.save();

        console.log("product store", productStore);

        await Transactionitem.create({
          transaction_id: newTransaction.id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          admin_discount: product.admin_discount,
          price: product.price,
        });
      }

      await Uservoucher.update(
        { isused: true, transaction_id: newTransaction.id },
        { where: { id: voucherIds } }
      );

      if (total_price >= 100000) {
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        const newVoucher = await Voucherdetail.create({
          name: "Shop More, Save More",
          description: "Special discount after spending more than Rp.100.000",
          nominal: 5000,
          percent: null,
          type: "discount",
          expired: sevenDaysFromNow,
        });

        await Uservoucher.create({
          user_id: id,
          voucherdetail_id: newVoucher.id,
          isused: false,
        });
      }

      await createFreeShippingVoucher(id);
      await Cartitem.destroy({ where: { cart_id: cart.id } });
      await cart.update({ total_price: 0 });
      await cart.save();

      return res.status(200).json({ message: "Checkout successful", transaction: newTransaction });
    } catch (error) {
      return res.status(500).json({ message: "Failed", error: error.message });
    }
  },
};

module.exports = transactionController;
