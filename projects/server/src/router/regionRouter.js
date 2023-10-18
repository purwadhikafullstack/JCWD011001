const express = require("express");
const router = express.Router();
const regionController = require("../controllers/regionController");

router.get("/province", regionController.getProvince);
router.get("/city/:id", regionController.getCity);

module.exports = router;