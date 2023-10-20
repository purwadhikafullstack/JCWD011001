import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  cart: [],
  item: [],
  totalHarga: 0,
  carts: null,
};

export const CartReducer = createSlice({
  name: "CartReducer",
  initialState,
  reducers: {
    setItem: (state, action) => {
      state.item = [...action.payload];
    },
    setCarts: (state, action) => {
      state.carts = action.payload;
    },
    addToCart: (state, action) => {
      const { id, quantity } = action.payload;
      const existCartItemIndex = state.cart.findIndex((item) => item.id === id);

      if (existCartItemIndex !== -1) {
        state.cart = state.cart.map((item, index) => {
          if (index === existCartItemIndex) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        state.cart = [...state.cart, { ...action.payload, quantity }];
      }
      state.totalHarga += action.payload.price * quantity;
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
      const { id } = action.payload;
      const existCart = state.cart.findIndex((item) => item.id === id);
      if (existCart !== -1) {
        state.totalHarga -= action.payload.price * state.cart[existCart].quantity;
        state.cart.splice(existCart, 1);
      }
    },
  },
});
export const getItem = (store_id) => {
  return async (dispatch) => {
    if (!store_id) return;
    const token = localStorage.getItem("token");
    try {
      const fetchData = await axios.get(`${URL_API}/cart/item/${store_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await dispatch(setItem(fetchData.data?.data));
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
      await dispatch(setCarts(response.data?.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addCart = (products,store_id, quantity, Swal) => {
  return async (dispatch) => {
    const dataProduct = products.Product || products;
    const discount = products.price - products.admin_discount
    const total_price = discount * quantity;
    const productId = dataProduct.product_id || dataProduct.id;
    const token = localStorage.getItem("token");
    try {
      const result = await axios.patch(
        `${URL_API}/cart/`,
        { productId, total_price, store_id, quantity },
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
    } catch (error) {
      console.log(error);
    }
  };
};
export const addQuantity = (products, Swal) => {
  return async (dispatch) => {
    const productId = products.product_id;
    const total_price = products.price;
    const store_id = products.store_id;
    const token = localStorage.getItem("token");
    try {
      const result = await axios.patch(
        `${URL_API}/cart/quantity`,
        { productId, total_price, store_id },
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

export const deleteItem = (products) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    const total_price = products.price;
    try {
      const response = await axios.patch(
        `${URL_API}/cart/item`,
        { productId: products.product_id, total_price, store_id: products.store_id },
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
    const dataProduct = products.Product || products;
    const item = products.product_id;
    const total_price = dataProduct.price;
    const productId = dataProduct.product_id || item;
    const token = localStorage.getItem("token");
    try {
      const result = await axios.delete(`${URL_API}/cart/item/delete/${productId}/${products.store_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const { addToCart, deleteFromCart, setItem, setCarts, deleteItemCart } = CartReducer.actions;
export default CartReducer.reducer;
