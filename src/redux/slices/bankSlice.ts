import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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
  isError: boolean;
  listBank: Bank[];
};
const initialState: BankType = {
  isLoading: false,
  isError: false,
  listBank: [],
};
export const getAllBank = createAsyncThunk("booking/getAllBookingofUsers", async () => {
  try {
    const response = await axios.get(`https://api.vietqr.io/v2/banks`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
});

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
  },
});
export default BankSlice.reducer;
