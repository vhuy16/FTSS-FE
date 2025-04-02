import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

export type Voucher = {
  id: string;
  voucherCode: string;
  description: string;
  discount: number;
  createDate: string;
  modifyDate: string;
  status: string;
  quantity: number;
  maximumOrderValue: number;
  expiryDate: string;
  discountType: number;
};

type ServiceStateType = {
  isLoading: boolean | null;
  vouchers: Voucher[];
  isError: boolean | null;
};
export const initialState: ServiceStateType = {
  isLoading: false,
  isError: false,
  vouchers: [],
};

export const getAllVouchers = createAsyncThunk("voucher/getAllVouchers", async () => {
  try {
    const response = await myAxios.get(`/voucher?size=100&isAscending=false`);
    return response.data.data.vouchers;
  } catch (error: any) {
    console.error("Error fetching service:", error);
    throw error;
  }
});

const voucherSlice = createSlice({
  name: "voucherSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVouchers.pending, (state) => {
        state.isLoading = true;

        state.isError = null;
      })
      .addCase(getAllVouchers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vouchers = action.payload; // lam theo cai ta return
        state.isError = null;
      })
      .addCase(getAllVouchers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default voucherSlice.reducer;
