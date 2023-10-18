const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { Transaction, Product, ProductStore, Transactionitem, Cart, Cartitem, Voucherdetail, Uservoucher, Storestockhistory } = db;

const createFreeShippingVoucher = async (userId) => {
  try {
    const successfulTransactionsCount = await Transaction.count({
      where: {
        user_id: userId,
        status: 6,
      },
    });
    if (successfulTransactionsCount % 5 === 0 && successfulTransactionsCount > 0) {
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
      res.status(200).json({ message: "Get Transaction Success", totalPage, data: transaction });
    } catch (error) {
      res.status(500).json({ message: "Get Transaction Failed", error: error.message });
    }
  },
  getFinishedTransaction: async (req, res) => {
    try {
      const { page = 1, limit = 3, order = "ASC", orderBy = "id", startDate, endDate } = req.query;

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
      const item = await Transactionitem.findAll({
        where: { transaction_id: id },
        include: Product,
      });
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
        duration,
      } = req.body;

      const cartItems = await Cartitem.findAll({
        where: { cart_id: cart.id, store_id: store_id },
      });

      let total_discount = 0;
      for (const cartItem of cartItems) {
        const product = await Product.findByPk(cartItem.product_id);
        const discountForCartItem = product.admin_discount * cartItem.quantity;
        total_discount += discountForCartItem;
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
        duration,
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
        });

        const soldQuantity = cartItem.quantity;
        const remainingQuantity = productStore.quantity - soldQuantity;

        await productStore.update({
          quantity: remainingQuantity,
        });
        await productStore.save();

        if (remainingQuantity === 0) {
          await productStore.update({
            isactive: false,
          });
          await productStore.save();
        };

        await Storestockhistory.create({
          product_id: cartItem.product_id,
          store_id: store_id,
          quantity: remainingQuantity,
          description: `Sold ${soldQuantity} pcs`,
        });

        await Transactionitem.create({
          transaction_id: newTransaction.id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          admin_discount: product.admin_discount,
          price: product.price,
        });
      }

      await Uservoucher.update({ isused: true, transaction_id: newTransaction.id }, { where: { id: voucherIds } });

      await createFreeShippingVoucher(id);
      await Cartitem.destroy({ where: { cart_id: cart.id, store_id: store_id } });
      await cart.update({ total_price: 0 });
      await cart.save();

      return res.status(200).json({ message: "Checkout successful", transaction: newTransaction });
    } catch (error) {
      return res.status(500).json({ message: "Failed", error: error.message });
    }
  },
  uploadProduct: async (req, res) => {
    const { id } = req.user;
    console.log(1);
    try {
      const { id_transaction } = req.body;
      console.log(id_transaction);
      const findTransaction = await Transaction.findOne({ where: { id: id_transaction, user_id: id, status: 0 } });
      if (!findTransaction) return res.status(404).json({ message: "Transaction not found" });
      const image = req.file.path;
      await db.sequelize.transaction(async (t) => {
        const data = await Transaction.update(
          { transaction_img: image, message: null, status: 1 },
          { where: { id: id_transaction } },
          { transaction: t }
        );
        return res.status(200).json({ message: "Success", data });
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed", error: error.message });
    }
  },
};

module.exports = transactionController;
