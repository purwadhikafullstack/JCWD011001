const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { cartController } = require("../controllers");
const router = express.Router();

router.patch("/", verifyToken, cartController.addCartItem);
router.patch("/item", verifyToken, cartController.removeItemCart);
router.get("/item", verifyToken, cartController.getItemsCart);
router.get("/", verifyToken, cartController.getCart);
router.delete("/item/delete/:productId", verifyToken, cartController.removeFromCart);
router.post("/ongkir", verifyToken, cartController.getRajaOngkir);

module.exports = router;
