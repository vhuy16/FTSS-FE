import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

export const verifyAccount = createAsyncThunk(
  "user/verifyAccount",
  async (data: { userId: string; otpCheck: string }, { rejectWithValue }) => {
    try {
      const response = await myAxios.post("/verify-otp", data);
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

// Xác minh quên mật khẩu OTP
export const verifyForgotPassword = createAsyncThunk(
  "user/verifyForgotPassword",
  async (data: { userId: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await myAxios.post("/verify-forgot-password", data);
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
  forgotPasswordVerified: false,
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
        state.isVerified = action.payload;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isVerified = false;
      })

      // Xử lý verifyForgotPassword
      .addCase(verifyForgotPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.forgotPasswordVerified = false;
      })
      .addCase(verifyForgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.forgotPasswordVerified = action.payload;
      })
      .addCase(verifyForgotPassword.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.forgotPasswordVerified = false;
      });
  },
});
export default verifyAccountSlice.reducer;
