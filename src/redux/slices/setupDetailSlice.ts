import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
import { SetupPackage } from "./setupSlice";

type initialStateSetup = {
  data: SetupPackage | null;
  isLoading: boolean;
  isError: boolean;
};

export const getSetupDetail = createAsyncThunk(
  "product/getSetupDetail",
  async (setupPackageId: string, { rejectWithValue }) => {
    try {
      const response = await myAxios.get(`/setuppackage/${setupPackageId}`);
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lấy sản phẩm chi tiết thất bại");
    }
  }
);

const initialState: initialStateSetup = {
  data: null,
  isLoading: false,
  isError: false,
};

const setupDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSetupDetail.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getSetupDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      })
      .addCase(getSetupDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default setupDetailSlice.reducer;
