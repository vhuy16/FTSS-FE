import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
import { SetupPackage } from "./setupSlice";

export type Order = {
  id: string;
  totalPrice: number;
  status: string;
  shipCost: number;
  createDate: string;
  modifyDate: string | null;
  address: string;
  discount: number;
  userResponse: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  orderDetails: OrderDetail[];
  payment: {
    paymentId: string | null;
    paymentStatus: string | null;
    paymentMethod: string | null;
  };
  oderCode: string;
  setupPackage: SetupPackage;
  isAssigned: boolean;
  isEligible: boolean;
  phoneNumber: string;
};
export interface OrderDetail {
  productName: string;
  price: number;
  quantity: number;
  linkImage: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu orders từ API get order by Buyyer
export const getAllOrdersByUsers = createAsyncThunk("orders/getAllOrdersByUsers", async (status?: string) => {
  const statusQuery = status ? `&status=${status}` : ""; // Nếu có status thì thêm vào query
  const response = await myAxios.get(`/order/get-all-order?page=1&size=1000&isAscending=false${statusQuery}`);
  return response.data.data.orders;
});

const orderListSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersByUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrdersByUsers.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrdersByUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderListSlice.reducer;
