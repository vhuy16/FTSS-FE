import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
export type RegisterType = {
  email: string;
  address: string;
  phoneNumber: string;
  password: string;
  userName: string;
  fullName: string;
  gender: number;
  cityId: string;
  districtId: string;
};
export const createAccount = createAsyncThunk("user/createAccount", async (data: RegisterType, { rejectWithValue }) => {
  try {
    const response = await myAxios.post("/user/register", data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

export const googleSignin = createAsyncThunk("user/googleSignin", async (any, { rejectWithValue }) => {
  try {
    const response = await myAxios.get("https://api.ftss.id.vn/api/v1/google-auth/login");
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

interface ApiResponseRegister {
  status: string; // Mã trạng thái trả về từ server (200, 404, 500, ...)
  message: string; // Thông điệp trả về từ server
  data: CustomerAccount | null; // Dữ liệu chi tiết, có thể null nếu xảy ra lỗi
  listErrorMessage: string[] | null; // Danh sách thông báo lỗi, nếu có
}

interface CustomerAccount {
  id: string; // ID duy nhất của tài khoản khách hàng
  username: string; // Tên người dùng
  password: string | null; // Mật khẩu, có thể null nếu không được trả về
  email: string; // Email của khách hàng
  fullName: string; // Họ và tên đầy đủ của khách hàng
  address: string; // Địa chỉ của khách hàng
  gender: number; // Giới tính, thường dùng 0 (nam), 1 (nữ), hoặc 2 (khác)
  phoneNumber: string; // Số điện thoại của khách hàng
}

type registerdata = {
  message: string;
  isLoading: boolean;
  isError: boolean;
  data: ApiResponseRegister | null;
};
const initialState: registerdata = {
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
      })
      .addCase(googleSignin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(googleSignin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Thông tin trả về từ API
      })
      .addCase(googleSignin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true; // Thông báo lỗi
      });
  },
});
export default registerSlice.reducer;
