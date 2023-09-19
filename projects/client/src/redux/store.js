import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./reducer/AuthReducer";
import ProductReducer from "./reducer/ProductReducer";
import AdminReducer from "./reducer/AdminReducer";
import CategoryReducer from "./reducer/CategoryReducer";
import AddressReducer from "./reducer/AddressReducer";
import CartReducer from "./reducer/CartReducer";

export const store = configureStore({
  reducer: {
    AuthReducer: AuthReducer,
    ProductReducer: ProductReducer,
    AdminReducer: AdminReducer,
    CategoryReducer: CategoryReducer,
    AddressReducer: AddressReducer,
    CartReducer : CartReducer
  },
});
