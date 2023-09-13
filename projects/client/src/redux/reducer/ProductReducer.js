import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  product: [],
  store_id: null,
  page: 1,
  productDetail: null,
  storeStock: [],
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
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setProductDetail: (state, action) => {
      state.productDetail = action.payload;
    },
    setStoreStock: (state, action) => {
      state.storeStock = [...action.payload];
    },
  },
});

export const getProduct = ({ index = 1 }) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/product/?page=${index}`);
      dispatch(setPage(data.totalPage));
      dispatch(setProduct(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getStoreProduct = ({ lat, lon, index = 1 }) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/store/nearest/?lat=${lat} &lon=${lon}`);
      if (!data.data.id) getProduct({ index });
      else dispatch(getStoreProductNext({ store_id: data.data.id, index }));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getStoreProductNext = ({ store_id, index }) => {
  return async (dispatch) => {
    try {
      const products = await axios.get(`${URL_API}/product/store/?store_id=${store_id}&page=${index}`);
      dispatch(setPage(products.data.totalPage));
      dispatch(setProduct(products.data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getStore_id = ({ lat, lon }) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/store/nearest/?lat=${lat} &lon=${lon}`);
      if (data) return dispatch(setStore_id(data.data.id));
      else dispatch(setStore_id(null));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getStoreStock = ({ id }) => {
  return async (dispatch) => {
    try {
      console.log(id);
      const { data } = await axios.get(`${URL_API}/product/stock/${id}`);
      dispatch(setStoreStock(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const { setProduct, setStore_id, setPage, setProductDetail, setStoreStock } = ProductReducer.actions;
export default ProductReducer.reducer;
