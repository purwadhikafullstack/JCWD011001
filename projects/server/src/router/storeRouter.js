const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const { verifyToken } = require("../middleware/auth");

router.get("/", storeController.cekStore);
router.get("/nearest", storeController.cekNearestStore);
router.get("/branch", storeController.getStore);
router.get("/stock", verifyToken, storeController.getStoreStockHistory);

module.exports = router;
