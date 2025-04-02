import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

export type Voucher = {
  id: string;
  voucherCode: string;
  discount: number;
  description: string;
  status: string;
  discountType: string;
  quantity: number;
  maximumOrderValue: number;
  expiryDate: string;
  createDate: string;
  modifyDate: string;
};

type MissionType = {
  isLoading: boolean;
  isLoadingAdd: boolean;
  isError: boolean;
  listVoucher: Voucher[];
};
const initialState: MissionType = {
  isLoading: false,
  isLoadingAdd: false,
  isError: false,
  listVoucher: [],
};

export const getAllVoucher = createAsyncThunk("voucher/getAllVoucher", async (_, { rejectWithValue }) => {
  try {
    const response = await myAxios.get(`/voucher/get-all-voucher?size=10&isAscending=false`);
    return response.data.data.vouchers;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Something went wrong";
    return rejectWithValue(errorMessage);
  }
});
export const addVoucher = createAsyncThunk("voucher/addVoucher", async (data: any, { dispatch, rejectWithValue }) => {
  try {
    const response = await myAxios.post(`/voucher`, data);
    await dispatch(getAllVoucher());
    return response.data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Something went wrong");
  }
});

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVoucher.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllVoucher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.listVoucher = action.payload;
      })
      .addCase(getAllVoucher.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(addVoucher.pending, (state) => {
        state.isLoadingAdd = true;
        state.isError = false;
      })
      .addCase(addVoucher.fulfilled, (state, action) => {
        state.isLoadingAdd = false;
        state.isError = false;
      })
      .addCase(addVoucher.rejected, (state, action) => {
        state.isLoadingAdd = false;
        state.isError = true;
      });
  },
});

export default voucherSlice.reducer;
