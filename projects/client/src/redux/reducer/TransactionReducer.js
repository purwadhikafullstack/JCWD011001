import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  transaction: [],
  finishedTransaction: [],
  itemTransaction: [],
  page: 1,
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
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const getTransaction = ({ index = 1, startDate, endDate, orderBy, order }) => {
  return async (dispatch) => {
    let query = `?page=${index}`;
    if (startDate) query += `&startDate=${startDate}`;
    if (endDate) query += `&endDate=${endDate}`;
    if (orderBy) query += `&orderBy=${orderBy}`;
    if (order) query += `&order=${order}`;
    try {
      const { data } = await axios.get(`${URL_API}/transaction/${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(setPage(data.totalPage));
      dispatch(setTransaction(data.data));
      dispatch(getTransactionItem(data.data[0]?.id));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getFinshedTransaction = ({ index = 1, startDate, endDate, orderBy, order }) => {
  return async (dispatch) => {
    try {
      let query = `?page=${index}`;
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;
      if (orderBy) query += `&orderBy=${orderBy}`;
      if (order) query += `&order=${order}`;

      const { data } = await axios.get(`${URL_API}/transaction/done/${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(setPage(data.totalPage));
      dispatch(setTransaction(data.data));
      dispatch(getTransactionItem(data.data[0]?.id));
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
      dispatch(setItemTransaction(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const uploadTransactionImage = (id, file, toast, navigate) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("transaction_img", file);
      formData.append("id_transaction", id);

      const { data } = await axios.patch(`${URL_API}/transaction/upload/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast({
        title: "Success",
        description: "Transaction image uploaded",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate(`/User-Order`);
      }, 300);
    } catch (error) {
      console.log(error);
    }
  };
};

export const { setTransaction, setItemTransaction, setPage } = TransactionReducer.actions;
export default TransactionReducer.reducer;
