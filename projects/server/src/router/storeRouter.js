const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.get("/", storeController.cekStore);
router.get("/nearest", storeController.cekNearestStore);
router.get("/branch", storeController.getStore)

module.exports = router;
