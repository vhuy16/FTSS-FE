import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
import { Service } from "./serviceSlice";

export type ListServiceHistory = {
  scheduleDate: string;
  services: Service[];
};

type ListServiceHistoryType = {
  isLoading: boolean;
  isError: boolean;
  ListServiceHistory: ListServiceHistory[];
};
const initialState: ListServiceHistoryType = {
  isLoading: false,
  isError: false,
  ListServiceHistory: [],
};

export const getAllServiceSetupHistory = createAsyncThunk(
  "historyServiceSetup/getAllServiceSetupHistory",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await myAxios.get(`/booking/get-history-order/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const historyServiceSetupSlice = createSlice({
  name: "historyServiceSetup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllServiceSetupHistory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllServiceSetupHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.ListServiceHistory = action.payload;
      })
      .addCase(getAllServiceSetupHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default historyServiceSetupSlice.reducer;
