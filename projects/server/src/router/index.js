const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const adminRouter = require("./adminRouter");
const profileRouter = require("./profileRouter");
const storeRouter = require("./storeRouter");
const categoryRouter = require("./categoryRouter");
const cartRouter = require("./cartRouter");
const transactionRouter = require("./transactionRouter");
const addressRouter = require("./addressRouter");
const regionRouter = require("./regionRouter");
const voucherRouter = require("./voucherRouter");

module.exports = {
  authRouter,
  productRouter,
  storeRouter,
  adminRouter,
  profileRouter,
  categoryRouter,
  cartRouter,
  transactionRouter,
  addressRouter,
  regionRouter,
  voucherRouter,
};
