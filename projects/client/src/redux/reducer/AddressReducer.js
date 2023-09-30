import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setUserLocation } from "./AuthReducer";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  address: [],
  userAddress: [],
  defaultAddress: null,
};

export const AddressReducer = createSlice({
  name: "AddressReducer",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = [...action.payload];
    },
    setUserAddress: (state, action) => {
      state.userAddress = [...action.payload];
    },
    setDefaultAddress: (state, action) => {
      state.defaultAddress = action.payload;
    },
  },
});

export const addAddress = (fullAddress, id, latitude, longitude, city_id, toast, onClose) => {
  return async () => {
    try {
      await axios.post(`${URL_API}/address`, {
        user_id: id,
        address: fullAddress,
        longitude,
        latitude,
        city_id: city_id,
      });
      toast({
        title: "Address Added",
        description: "Address has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const getAddress = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/address/${id}`);
      await dispatch(setUserAddress(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteAddress = (address_id, toast) => {
  return async () => {
    try {
      await axios.patch(`${URL_API}/address/deactivate/${address_id}`);
      toast({
        title: "Success",
        description: "Address has been deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: error.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const editAddress = (address_id, id, fullAddress, latitude, longitude, toast, onClose) => {
  return async () => {
    try {
      await axios.patch(`${URL_API}/address/${address_id}`, {
        user_id: id,
        address: fullAddress,
        longitude,
        latitude,
      });
      toast({
        title: "Success",
        description: "Address has been updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Failed",
        description: error.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const setPrimaryAddress = (id, toast) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.patch(`${URL_API}/address/default/${id}`);
      toast({
        title: "Success",
        description: "Address has been set as default",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await dispatch(setUserLocation(data.data.latitude, data.data.longitude));
    } catch (error) {
      toast({
        title: "Failed",
        description: error.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const getDefaultAddress = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/address/default`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await dispatch(setUserLocation(data.data?.latitude, data.data?.longitude));
      await dispatch(setDefaultAddress(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const { setAddress, setUserAddress, setDefaultAddress } = AddressReducer.actions;

export default AddressReducer.reducer;