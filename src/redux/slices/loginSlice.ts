import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
import { LoginType } from "@components/pages/Login/Login";

export const loginUser = createAsyncThunk("user/login", async (data: LoginType, { rejectWithValue }) => {
  try {
    const response = await myAxios.post("/user/login", data);
    return response.data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(
      error.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không chính xác" || "An unknown error occurred"
    );
  }
});

const initialState = {
  message: "",
  isLoading: false,
  isError: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message as string;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});
export default loginSlice.reducer;
