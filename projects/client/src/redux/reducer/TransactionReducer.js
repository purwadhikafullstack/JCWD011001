import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  transaction: [],
  itemTransaction: [],
};

export const TransactionReducer = createSlice({
  name: "TransactionReducer",
  initialState,
  reducers: {
    setTransaction: (state, action) => {
      state.transaction = [...action.payload];
    },
    setItemTransaction: (state, action) => {
      state.itemTransaction = [...action.payload];
    },
  },
});

export const getTransaction = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/transaction`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(setTransaction(data.data));
      dispatch(getTransactionItem(data.data[0].id));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getFinshedTransaction = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/transaction/done`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(setTransaction(data.data));
      dispatch(getTransactionItem(data.data[0].id));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getTransactionItem = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/transaction/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(data.data);
      dispatch(setItemTransaction(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const { setTransaction, setItemTransaction } = TransactionReducer.actions;
export default TransactionReducer.reducer;
