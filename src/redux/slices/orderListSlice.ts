import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

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
export const getAllOrdersByUsers = createAsyncThunk("orders/getAllOrdersByUsers", async () => {
  const response = await myAxios.get(`https://ftss.id.vn/api/v1/order/get-all-order`);
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
