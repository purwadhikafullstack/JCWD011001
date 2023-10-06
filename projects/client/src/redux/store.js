import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./reducer/AuthReducer";
import ProductReducer from "./reducer/ProductReducer";
import AdminReducer from "./reducer/AdminReducer";
import CategoryReducer from "./reducer/CategoryReducer";
import AddressReducer from "./reducer/AddressReducer";
import CartReducer from "./reducer/CartReducer";
import TransactionReducer from "./reducer/TransactionReducer";
import VoucherReducer from "./reducer/VoucherReducer";
import UserOrderReducer from "./reducer/UserOrderReducer";

export const store = configureStore({
  reducer: {
    AuthReducer: AuthReducer,
    ProductReducer: ProductReducer,
    AdminReducer: AdminReducer,
    CategoryReducer: CategoryReducer,
    CartReducer: CartReducer,
    TransactionReducer: TransactionReducer,
    AddressReducer: AddressReducer,
    VoucherReducer: VoucherReducer,
    UserOrderReducer: UserOrderReducer,
  },
});
