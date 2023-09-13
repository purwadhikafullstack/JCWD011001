const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getProduct);
router.get("/store", productController.getProductStore);
router.get("/detail", productController.getProductStock);
router.get("/stock", productController.getStoreProduct);
module.exports = router;
