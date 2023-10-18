const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");

router.get("/", productController.getProduct);
router.get("/store", productController.getProductStore);
router.get("/detail", productController.getProductStock);
router.get("/stock", productController.getStoreProductEachBranch);
router.get("/search", productController.getSearchProduct);
router.post("/", multerUpload.single("product_img"), productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.patch("/picture/:id", multerUpload.single("product_img"), productController.changeProductPicture);
// router.patch("/:id", multerUpload.single("product_img"), productController.updateProduct)
router.patch("/delete/:id", productController.deleteProduct);
router.patch("/restore/:id", productController.activeProduct);
router.get("/item/detail/:id/:store_id", productController.getItemDetail)

module.exports = router;
