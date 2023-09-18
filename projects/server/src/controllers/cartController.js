const db = require("../../models")
const product = db.Product
const cart = db.Cart
const items = db.Cartitem

const cartController = {
    addCartItem: async (req, res) => {
        try {
          const {id} = req.user
          const { total_price, cartId, productId } = req.body;
          const checkCart = await cart.findOne({where : {user_id : id}})
          console.log("cart back => ", checkCart)
          const checkProduct = await product.findOne({where : {id : productId}})
          console.log("backend product => ",checkProduct)
          const totalPrice = checkCart.total_price +=  checkProduct.price
          console.log("total_price db => ", totalPrice)
          const checkItem = await items.findOne({where : {product_id:checkProduct.id}})
          await db.sequelize.transaction(async (t) => {
              const result = await cart.update({total_price : totalPrice }, {where : {user_id : id}}, { transaction: t });
            if(checkItem){
                if(checkItem.quantity === null) {
                    checkItem.quantity = 1;    
                }
                if(checkItem.quantity >= 0){
                    checkItem.quantity += 1
                }
                checkItem.save()
                console.log("quantity ", checkItem.quantity)
                return res.status(200).json({message : "Success"})
            }else {
                const addItem = await items.create({name : checkProduct.name, product_id:checkProduct.id, quantity : 1 , price:checkProduct.price, cart_id:checkCart.id })
                return res.status(200).json({ message: "Success", data : addItem});
            }
          });
        } catch (error) {
          return res.status(500).json({ message: "Failed", error: error.message });
        }
      },
    removeItemCart : async (req, res) => {
        try {
            const {id} = req.user
            const { total_price, cartId, productId } = req.body;
            const checkCart = await cart.findOne({where : {user_id : id}})
            console.log("cart back remove => ", checkCart)
            const checkProduct = await product.findOne({where : {id : productId}})
            console.log("backend product remove => ",checkProduct)
            const totalPrice = checkCart.total_price -=  checkProduct.price
            console.log("total_price db remove=> ", totalPrice)
            const checkItem = await items.findOne({where : {product_id:checkProduct.id}})
            console.log("check Item remove ", checkItem)
            await db.sequelize.transaction(async (t) => {
                if(totalPrice !== 0){
                    const result = await cart.update({total_price : totalPrice }, {where : {user_id : id}}, { transaction: t });
                }
              if(checkItem){
                  if(checkItem.quantity > 1){
                      checkItem.quantity -= 1
                  }
                  checkItem.save()
                  console.log("quantity decrement ", checkItem.quantity)
                  return res.status(200).json({message : "Success"})
              }
            });
          } catch (error) {
            return res.status(500).json({ message: "Failed", error: error.message });
          }
    },
    getItemsCart: async (req, res) => {
        try {
          const findCarts = await items.findAll({
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          });
          res.status(200).json({ data: findCarts });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
      getCart : async(req,res) => {
        try {
            const findCart = await cart.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
            })
            return res.status(200).json({message : "Success", data : findCart})
        } catch (error) {
            return res.status(500).json({error : error.message})
        }
      }
}

module.exports = cartController