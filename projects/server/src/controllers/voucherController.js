const db = require("../models");
const { Op } = require("sequelize");
const Voucherdetail = db.Voucherdetail;
const Uservoucher = db.Uservoucher;
const User = db.User;

const voucherController = {
  createDiscountVoucher: async (req, res) => {
    try {
      const {
        name,
        product_id,
        description,
        nominal,
        percent,
        minimum_payment,
        type,
        expired,
      } = req.body;

      const expirationDate = new Date(expired);
      const currentDate = new Date();

      if (expirationDate <= currentDate) {
        return res
          .status(400)
          .json({ message: "Expired date must be in the future" });
      }

      const voucherExist = await Voucherdetail.findOne({
        where: { name, isactive: true },
      });

      if (voucherExist) {
        return res.status(400).json({ message: "Voucher already exists" });
      }

      if (nominal > 0 && percent > 0) {
        return res.status(400).json({
          message: "You must fill either nominal or percent, not both",
        });
      }

      await db.sequelize.transaction(async (t) => {
        const newVoucher = await Voucherdetail.create(
          {
            name,
            product_id,
            description,
            nominal,
            percent,
            minimum_payment,
            type,
            expired,
          },
          { transaction: t }
        );

        const users = await User.findAll();

        const userVouchers = users.map(async (user) => {
          const userVoucher = await Uservoucher.create(
            {
              user_id: user.id,
              voucherdetail_id: newVoucher.id,
              transaction_id: null,
              isused: false,
            },
            { transaction: t }
          );
          return userVoucher;
        });

        await Promise.all(userVouchers);

        return res.status(200).json({
          message: "Voucher created",
          data: newVoucher,
        });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getAdminVoucher: async (req, res) => {
    try {
      const vouchers = await Voucherdetail.findAll({
        where: {
          isactive: true,
          name: {
            [Op.not]: ["Referral Voucher", "Shop More, Save More"],
          },
          type: {
            [Op.notLike]: "freedelivery",
          },
        },
        attributes: { exclude: ["createdAt", "updatedAt", "isactive"] },
      });
      return res.status(200).json({ message: "Success", vouchers });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUserVoucher: async (req, res) => {
    try {
      const { id } = req.user;
      const currentDate = new Date();
      const vouchers = await Uservoucher.findAll({
        where: {
          isused: false,
          user_id: id,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Voucherdetail,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            where: {
              isactive: true,
              type: {
                [Op.notLike]: "freedelivery",
              },
              expired: {
                [Op.gte]: currentDate,
              },
            },
          },
        ],
      });

      return res.status(200).json({ message: "Success", vouchers });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteVoucher: async (req, res) => {
    try {
      const { id } = req.params;
      await db.sequelize.transaction(async (t) => {
        await Voucherdetail.update(
          { isactive: false },
          { where: { id } },
          { transaction: t }
        );

        await Uservoucher.destroy(
          { where: { voucherdetail_id: id } },
          { transaction: t }
        );
        return res.status(200).json({ message: "Voucher deleted" });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getFreeDeliveryVoucher: async (req, res) => {
    try {
      const { id } = req.user;
      const vouchers = await Uservoucher.findAll({
        where: {
          isused: false,
          user_id: id,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Voucherdetail,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            where: {
              type: "freedelivery",
            },
          },
        ],
      });
      return res.status(200).json({ message: "Success", vouchers });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = voucherController;
