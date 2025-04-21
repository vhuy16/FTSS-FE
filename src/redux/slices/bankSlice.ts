import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import myAxios from "@setup/axiosConfig";

export type Bank = {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
};

type BankType = {
  isLoading: boolean;
  isLoadingUpdate: boolean;
  isError: boolean;
  listBank: Bank[];
};
const initialState: BankType = {
  isLoading: false,
  isError: false,
  isLoadingUpdate: false,
  listBank: [],
};
export const getAllBank = createAsyncThunk("booking/getAllBank", async () => {
  try {
    const response = await axios.get(`https://api.vietqr.io/v2/banks`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
});
export const updateBankInfo = createAsyncThunk(
  "user/updateBankInfo",
  async (
    { bankNumber, bankName, bankHolder }: { bankNumber: string; bankName: string; bankHolder: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("BankNumber", bankNumber);
      formData.append("BankName", bankName);
      formData.append("BankHolder", bankHolder);

      const response = await myAxios.put(`/user/update-bank-infor`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Cập nhật thông tin ngân hàng thất bại");
    }
  }
);

const BankSlice = createSlice({
  name: "Bank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBank.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.listBank = action.payload;
      })
      .addCase(getAllBank.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(updateBankInfo.pending, (state) => {
        state.isLoadingUpdate = true;
        state.isError = false;
      })
      .addCase(updateBankInfo.fulfilled, (state, action) => {
        state.isLoadingUpdate = false;
        state.isError = false;
      })
      .addCase(updateBankInfo.rejected, (state, action) => {
        state.isLoadingUpdate = false;
        state.isError = true;
      });
  },
});
export default BankSlice.reducer;
