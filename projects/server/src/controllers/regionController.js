const axios = require("axios");
const API_KEY = process.env.RO_KEY;

const regionController = {
  getProvince: async (req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        {
          headers: {
            key: API_KEY,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching provinces", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getCity: async (req, res) => {
    try {
        const { id } = req.params;
      const response = await axios.get(
        `https://api.rajaongkir.com/starter/city?province=${id}`,
        {
          headers: {
            key: API_KEY,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching cities", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = regionController;