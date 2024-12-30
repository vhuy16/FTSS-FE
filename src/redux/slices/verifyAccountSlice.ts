import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const verifyAccount = createAsyncThunk(
  "user/verifyAccount",
  async (data: { userId: string; otpCheck: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://ftss.id.vn/api/v1/user/verify-otp", data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

const initialState = {
  isLoading: false,
  isError: false,
  isVerified: false,
};

const verifyAccountSlice = createSlice({
  name: "verify",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyAccount.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isVerified = false;
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isVerified = true;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isVerified = false;
      });
  },
});
export default verifyAccountSlice.reducer;
