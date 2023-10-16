const { Sequelize, Op, where } = require("sequelize");
const db = require("../../models");
const Store = db.Store;

const storeDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusKm * c;
  return distance;
};

const setPagination = (limit, page) => {
  const offset = (page - 1) * +limit;
  return { limit: parseInt(limit), offset };
};

const storeController = {
  cekStore: async (req, res) => {
    try {
      const { location } = req.query;
      const data = await Store.findOne({ where: { isactive: 1, location: { [Op.like]: `%${location}%` } } });
      if (data) return res.status(200).json({ data });
      return res.status(404).json({ message: "Store not found" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  cekNearestStore: async (req, res) => {
    try {
      const { lat, lon } = req.query;
      let nearest = 200;
      let data = {};
      const cek = await Store.findAll({ where: { isactive: 1 } });
      for (let i = 0; i < cek.length; i++) {
        const distance = storeDistance(lat, lon, parseFloat(cek[i].latitude), parseFloat(cek[i].longitude));
        if (nearest >= distance) {
          nearest = distance;
          data = cek[i];
        }
      }

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getStore: async (req, res) => {
    try {
      const data = await Store.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: db.Admin,
      });
      return res.status(200).json({ message: "Success Store", data: data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getStoreStockHistory: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 3,
        product_id,
        store_id,
        startDate,
        endDate,
        order = "DESC",
        orderBy = "createdAt",
      } = req.query;

      let filter = {};
      if (startDate) filter.createdAt = { [Op.gte]: new Date(startDate) };
      if (endDate) filter.createdAt = { [Op.lte]: new Date(endDate).setHours(23, 59, 59) };
      if (startDate && endDate) {
        filter = { createdAt: { [Op.between]: [new Date(startDate), new Date(endDate).setHours(23, 59, 59)] } };
      }
      const pagination = setPagination(limit, page);
      const totalHistory = await db.Storestockhistory.count({ where: { product_id, store_id, ...filter } });
      const totalPage = Math.ceil(totalHistory / +limit);

      const data = await db.Storestockhistory.findAll({
        where: { product_id, store_id, ...filter },
        ...pagination,
        order: [[orderBy, order]],
      });
      return res.status(200).json({ message: "Success", totalPage, data: data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getStorebyId: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Store.findOne({ where: { id } });
      return res.status(200).json({ message: "Success", data: data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = storeController;
