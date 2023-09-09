import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  product: [],
  store_id: null,
};

export const ProductReducer = createSlice({
  name: "ProductReducer",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = [...action.payload];
    },
    setStore_id: (state, action) => {
      state.store_id = action.payload;
    },
  },
});

export const getProduct = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/product`);
      console.log(data.data);
      dispatch(setProduct(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getStoreProduct = (userLocation) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/store/?location=${userLocation.city}`);
      dispatch(setStore_id(data.data.id));
      const products = await axios.get(`${URL_API}/product/store/?store_id=${data.data.id}`);
      dispatch(setProduct(products.data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const { setProduct, setStore_id } = ProductReducer.actions;
export default ProductReducer.reducer;
