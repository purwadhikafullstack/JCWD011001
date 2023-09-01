import { createSlice } from "@reduxjs/toolkit";

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

export const { loginSuccess, logoutSuccess } = AuthReducer.actions;

export default AuthReducer.reducer;
