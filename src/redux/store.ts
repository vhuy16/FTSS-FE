import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "./slices/addressSlice";
import registerReducer from "./slices/registerSlice";
import verifyAccountReducer from "./slices/verifyAccountSlice";
import loginReducer from "./slices/loginSlice";
import sidebarReducer from "./slices/sidebarSlice";
import searchReducer from "./slices/searchSlice";
import listCategoriesReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import productDetailReducer from "./slices/productDetailSlice";
import cartReducer from "./slices/cartSlice";
import forgotPasswordReducer from "./slices/forgotPasswordSlice";
import resetPasswordReducer from "./slices/resetPassword";
export const store = configureStore({
  reducer: {
    address: addressReducer,
    register: registerReducer,
    verifyAccount: verifyAccountReducer,
    login: loginReducer,
    sidebar: sidebarReducer,
    search: searchReducer,
    category: listCategoriesReducer,
    product: productReducer,
    productDetail: productDetailReducer,
    cart: cartReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
