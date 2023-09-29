import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  cart: [],
  item: [],
  totalHarga: 0,
  carts: [],
};

export const CartReducer = createSlice({
  name: "CartReducer",
  initialState,
  reducers: {
    setItem: (state, action) => {
      state.item = [...action.payload];
    },
    setCarts: (state, action) => {
      state.carts = [...action.payload];
    },
    addToCart: (state, action) => {
      const { id } = action.payload;
      const existCartItemIndex = state.cart.findIndex((item) => item.id === id);

      if (existCartItemIndex !== -1) {
        state.cart = state.cart.map((item, index) => {
          if (index === existCartItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      } else {
        state.cart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      state.totalHarga += action.payload.price;
    },
    deleteFromCart: (state, action) => {
      const { id } = action.payload;

      const existCart = state.cart.findIndex((item) => item.id === id);
      if (existCart !== -1) {
        if (state.cart[existCart].quantity > 0) {
          state.cart[existCart].quantity -= 1;
          state.totalHarga -= action.payload.price;
        }
      }
    },
    deleteItemCart: (state, action) => {
      console.log("dele", action.payload);
      const { id } = action.payload;
      console.log("isi del", id);
      const existCart = state.cart.findIndex((item) => item.id === id);
      if (existCart !== -1) {
        console.log("sampe");
        state.totalHarga -= action.payload.harga_produk * state.cart[existCart].quantity;
        state.cart.splice(existCart, 1);
      }
    },
  },
});
export const getItem = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const fetchData = await axios.get(`${URL_API}/cart/item`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setItem(fetchData.data?.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getCart = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${URL_API}/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("total price", response);
      dispatch(setCarts(response.data?.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addCart = (products, Swal) => {
  return async (dispatch) => {
    const dataProduct = products.Product || products;
    const discount = dataProduct.price - products.admin_discount;
    console.log("harga baru setelah diskon ", discount);
    const total_price = discount;
    const productId = dataProduct.product_id || dataProduct.id;
    console.log("id", productId);
    console.log("total", total_price);
    const token = localStorage.getItem("token");
    try {
      const result = await axios.patch(
        `${URL_API}/cart/`,
        { productId, total_price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Product successfully added to cart",
        showConfirmButton: false,
        timer: 1500,
      });
      // Swal.fire("Success!", "Product successfully added to cart", "success");
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteItem = (products) => {
  return async (dispatch) => {
    console.log("del ", products);
    console.log("del ", products.id);
    console.log("del id ", products.product_id);
    const token = localStorage.getItem("token");
    const total_price = products.price;
    try {
      const response = await axios.patch(
        `${URL_API}/cart/item`,
        { productId: products.product_id, total_price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteItemFromCart = (products) => {
  return async (dispatch) => {
    console.log("delete from", products);
    const dataProduct = products.Product || products;
    console.log("data delete", dataProduct);
    const total_price = dataProduct.price;
    console.log("price delete", total_price);
    const productId = dataProduct.product_id || dataProduct.id;
    console.log("id delete", productId);
    const token = localStorage.getItem("token");
    // Swal.fire({
    //   title: 'Do you want to save the changes?',
    //   showDenyButton: true,
    //   showCancelButton: true,
    //   confirmButtonText: 'Save',
    //   denyButtonText: `Don't save`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //     Swal.fire('Saved!', '', 'success')
    //   } else if (result.isDenied) {
    //     Swal.fire('Changes are not saved', '', 'info')
    //   }
    // })
    try {
      const result = await axios.delete(`${URL_API}/cart/item/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Uhhuy");
    } catch (error) {
      console.log(error);
    }
  };
};

export const { addToCart, deleteFromCart, setItem, setCarts, deleteItemCart } = CartReducer.actions;
export default CartReducer.reducer;
