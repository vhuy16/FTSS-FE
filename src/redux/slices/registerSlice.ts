import { RegisterType } from "@components/pages/Register";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
export const createAccount = createAsyncThunk("user/createBuyer", async (data: RegisterType, { rejectWithValue }) => {
  try {
    const response = await axios.post("https://ftss.id.vn/api/v1/user/register", data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

const initialState = {
  message: "",
  isLoading: false,
  isError: false,
  data: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
        state.message = action.payload.message;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.message = "Yêu cầu đăng ký không thành công. Tài khoản đã tồn tại !";
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default registerSlice.reducer;
