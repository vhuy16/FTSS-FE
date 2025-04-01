import { configureStore } from '@reduxjs/toolkit';
import addressReducer from './slices/addressSlice';
import registerReducer from './slices/registerSlice';
import verifyAccountReducer from './slices/verifyAccountSlice';
import loginReducer from './slices/loginSlice';
import sidebarReducer from './slices/sidebarSlice';
import searchReducer from './slices/searchSlice';
import listCategoriesReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import productDetailReducer from './slices/productDetailSlice';
import cartReducer from './slices/cartSlice';
import forgotPasswordReducer from './slices/forgotPasswordSlice';
import userProfileReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import shipmentReducer from './slices/shipmentSlice';
import orderListReducer from './slices/orderListSlice';
import setupPackageReducer from './slices/setupSlice';
import setupPackageDetailReducer from './slices/setupDetailSlice';
import dashboardReducer from './slices/dashboardSlice';
import listServiceReducer from './slices/listServiceSlice';
import bookingServiceReducer from './slices/bookingSlice';
import missionReducer from './slices/missionSlide';
import voucherReducer from './slices/voucherSlice';

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
        serviceList: listServiceReducer,
        bookingService: bookingServiceReducer,
        mission: missionReducer,
        voucher: voucherReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
