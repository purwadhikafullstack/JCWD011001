import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
    allUserOrder: [],
    branchUserOrder: [],
    orderItem: "",
    storeData: [],
    dailyOrderData: {},
    branchDailyOrderData: {},
    page: 1,
}

export const UserOrderReducer = createSlice({
    name: "UserOrderReducer",
    initialState,
    reducers: {
        setUserOrder: (state, action) => {
            state.allUserOrder = [...action.payload];
        },
        setBranchUserOrder: (state, action) => {
            state.branchUserOrder = [...action.payload];
        },
        setOrderItem: (state, action) => {
            state.orderItem = action.payload;
        },
        setStoreData: (state, action) => {
            state.storeData = [...action.payload];
        },
        setDailyOrderData: (state, action) => {
            state.dailyOrderData = {...action.payload};
        },
        setBranchDailyOrderData: (state, action) => {
            state.branchDailyOrderData = {...action.payload};
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

export const getBranchUserOrder = ({ index = 1, startDate, endDate, orderBy, order }) => {
    return async (dispatch) => {
        let query = `?page=${index}`;
        if (startDate) query += `&startDate=${startDate}`;
        if (endDate) query += `&endDate=${endDate}`;
        if (orderBy) query += `&orderBy=${orderBy}`;
        if (order) query += `&order=${order}`;
        try {
            const { data } = await axios.get(`${URL_API}/order/branch/${query}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            dispatch(setPage(data.totalPage));
            dispatch(setBranchUserOrder(data.data));
        } catch (error) {
            console.log(error);
        }
    }
}

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
};

export const getDailyOrderData = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`${URL_API}/order/daily`);
            await dispatch(setDailyOrderData(data.data));
        } catch (error) {
            console.log(error);
        }
    };
};

export const getBranchDailyOrderData = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`${URL_API}/order/branch-daily`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            await dispatch(setBranchDailyOrderData(data.data));
        } catch (error) {
            console.log(error);
        }
    };
}

export const { setUserOrder, setBranchUserOrder, setOrderItem, setStoreData, setDailyOrderData, setBranchDailyOrderData, setPage } = UserOrderReducer.actions;

export default UserOrderReducer.reducer;