import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
    allUserOrder: [],
    orderItem: "",
    storeData: [],
    page: 1,
}

export const UserOrderReducer = createSlice({
    name: "UserOrderReducer",
    initialState,
    reducers: {
        setUserOrder: (state, action) => {
            state.allUserOrder = [...action.payload];
        },
        setOrderItem: (state, action) => {
            state.orderItem = action.payload;
        },
        setStoreData: (state, action) => {
            state.storeData = [...action.payload];
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
    },
});

export const getAllUserOrder = ({ index = 1, startDate, endDate, orderBy, order, storeId }) => {
    return async (dispatch) => {
        let query = `?page=${index}`;
        if (startDate) query += `&startDate=${startDate}`;
        if (endDate) query += `&endDate=${endDate}`;
        if (orderBy) query += `&orderBy=${orderBy}`;
        if (order) query += `&order=${order}`;
        if (storeId) query += `&storeId=${storeId}`;
        try {
            console.log("isi query", query);
            const { data } = await axios.get(`${URL_API}/order/${query}`);
            dispatch(setPage(data.totalPage));
            dispatch(setUserOrder(data.data));
        } catch (error) {
            console.log(error);
        }
    };
};

export const getUserTransactionItem = (id) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`${URL_API}/order/${id}`);
            await dispatch(setOrderItem(data.data));
        } catch (error) {
            console.log(error);
        }
    };
};

export const clearOrderItem = () => {
    return async (dispatch) => {
        try {
            await dispatch(setOrderItem(""));
        } catch (error) {
            console.log(error);
        }
    };
};

export const getStoreData = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`${URL_API}/order/store`);
            await dispatch(setStoreData(data.stores));
        } catch (error) {
            console.log(error);
        }
    };
}

export const { setUserOrder, setOrderItem, setStoreData, setPage } = UserOrderReducer.actions;

export default UserOrderReducer.reducer;