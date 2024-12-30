import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "./slices/addressSlice";
import registerReducer from "./slices/registerSlice";
import verifyAccountReducer from "./slices/verifyAccountSlice";

export const store = configureStore({
  reducer: {
    address: addressReducer,
    register: registerReducer,
    verifyAccount: verifyAccountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
