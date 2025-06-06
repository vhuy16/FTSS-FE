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
import userProfileReducer from "./slices/userSlice";
import orderReducer from "./slices/orderSlice";
import shipmentReducer from "./slices/shipmentSlice";
import orderListReducer from "./slices/orderListSlice";
import setupPackageReducer from "./slices/setupSlice";
import setupPackageDetailReducer from "./slices/setupDetailSlice";
import dashboardReducer from "./slices/dashboardSlice";
import bookingServiceReducer from "./slices/bookingSlice";
import missionReducer from "./slices/missionSlide";
import voucherReducer from "./slices/voucherSlice";
import BankReducer from "./slices/bankSlice";
import issueCategoryReducer from "./slices/issueCategorySlice";
import issueReducer from "./slices/issueSlice";
import historyServiceReducer from "./slices/historyServiceSetupSlice";
import chatReducer from "./slices/chatSlice";
import serviceReducer from "./slices/serviceSlice";
import recommendReducer from "./slices/recommendSlice";
import chatbotReducer from "./slices/chatbotAlSlice";
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
    userProfile: userProfileReducer,
    order: orderReducer,
    shipment: shipmentReducer,
    orderList: orderListReducer,
    setupPackage: setupPackageReducer,
    setupPackageDetail: setupPackageDetailReducer,
    dashboard: dashboardReducer,
    bookingService: bookingServiceReducer,
    mission: missionReducer,
    voucher: voucherReducer,
    bank: BankReducer,
    issueCategory: issueCategoryReducer,
    issue: issueReducer,
    historyService: historyServiceReducer,
    chat: chatReducer,
    service: serviceReducer,
    recommend: recommendReducer,
    chatbot: chatbotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
