import { createSlice } from "@reduxjs/toolkit";
const axios = require("axios");

const initialState = {
  user: {
    id: null,
    username: "",
    email: "",
    password: "",
    // confirmPassword: ""
  },
  login: false,
};

export const AuthReducer = createSlice({
  name: "AuthReducer",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // state.user = {...action.payload};
      state.login = true;
      localStorage.setItem("token", action.payload);
    },
    logoutSuccess: (state) => {
      // state.user = initialState.user;
      state.login = false;
      localStorage.removeItem("token");
    },
  },
});

export const registerUser = (value, toast) => {
  return async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/user`, value);
      console.log(data);
      toast({
        title: "Register Success",
        description: `${value.username} berhasil dibuat`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error.response.data.message);
      toast({
        title: "Register Gagal",
        description: error.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const { loginSuccess, logoutSuccess } = AuthReducer.actions;
export default AuthReducer.reducer;
