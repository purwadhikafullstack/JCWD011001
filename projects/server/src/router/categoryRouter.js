const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { multerUpload } = require("../middleware/multer");

router.post("/", multerUpload.single("category_img"), categoryController.addCategory);
router.get("/", categoryController.getCategory);
router.get("/:id", categoryController.getCategoryById);
router.patch("/deactivate/:id", categoryController.deleteCategory);
router.patch("/:id", multerUpload.single("category_img"), categoryController.updateCategory);

module.exports = router;
