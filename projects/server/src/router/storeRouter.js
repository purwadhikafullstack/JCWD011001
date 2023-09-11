const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.get("/", storeController.cekStore);
router.get("/nearest", storeController.cekNearestStore);

module.exports = router;
