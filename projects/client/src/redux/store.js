import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./reducer/AuthReducer";
import AdminReducer from "./reducer/AdminReducer";

export const store = configureStore({
  reducer: {
    AuthReducer: AuthReducer,
    AdminReducer: AdminReducer,
  },
});
