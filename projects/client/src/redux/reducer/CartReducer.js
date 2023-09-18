import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
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
    const total_price = dataProduct.price;
    console.log("data", dataProduct);
    const productId = dataProduct.product_id || dataProduct.id;
    console.log("id", productId);
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
      Swal.fire("Success!", "Product successfully added to cart", "success");
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
        { productId: products.id, total_price },
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

export const { addToCart, deleteFromCart, setItem, setCarts } = CartReducer.actions;
export default CartReducer.reducer;
