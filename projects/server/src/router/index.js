const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const adminRouter = require("./adminRouter");
const profileRouter = require("./profileRouter");
const storeRouter = require("./storeRouter");
const categoryRouter = require("./categoryRouter");
const addressRouter = require("./addressRouter");
const regionRouter = require("./regionRouter");
const cartRouter = require("./cartRouter")

module.exports = { authRouter, productRouter, storeRouter, adminRouter, profileRouter, categoryRouter, addressRouter, regionRouter, cartRouter };
