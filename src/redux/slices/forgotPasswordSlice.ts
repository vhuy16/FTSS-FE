import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

// Định nghĩa kiểu cho dữ liệu Reset Password
type forgotPasswordType = {
  email: string;
};

export const forgotPassword = createAsyncThunk("user/resetPassword", async (data: forgotPasswordType) => {
  try {
    const request = await myAxios.post(`https://ftss.id.vn/api/v1/user/forgot-password`, data);
    const response = request.data;
    return response;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
});

type forgotPasswordStateType = {
  loading: boolean | null;
  message: string | null;
  error: string | null;
  data: any | null; // Thêm thuộc tính data
};

// Trạng thái ban đầu
const initialState: forgotPasswordStateType = {
  loading: false,
  message: "",
  error: null,
  data: null, // Khởi tạo data
};

// Tạo slice
const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
        state.data = null; // Reset data khi request mới bắt đầu
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message as string;
        state.error = null;
        state.data = action.payload.data; // Gán dữ liệu trả về từ API
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.data = null; // Reset data khi request thất bại
        if (action.error.message === "Request failed with status code 400") {
          state.error = "Gửi yêu cầu thất bại, vui lòng thử lại";
        } else {
          state.error = action.error.message || "Đã xảy ra lỗi không xác định";
        }
      });
  },
});

export default forgotPasswordSlice.reducer;
