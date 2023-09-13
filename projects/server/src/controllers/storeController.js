const { Sequelize, Op } = require("sequelize");
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

const storeController = {
  cekStore: async (req, res) => {
    try {
      const { location } = req.query;
      const data = await Store.findOne({ where: { location: { [Op.like]: `%${location}%` } } });
      if (data) return res.status(200).json({ data });
      return res.status(404).json({ message: "Store not found" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  cekNearestStore: async (req, res) => {
    try {
      const { lat, lon } = req.query;
      let nearest = 100;
      let data = {};
      const cek = await Store.findAll();
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
};

module.exports = storeController;
