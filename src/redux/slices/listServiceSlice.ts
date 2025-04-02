import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

export type ServicePackage = {
  id: string;
  serviceName: string;
  price: number;
};

type ServiceStateType = {
  isLoading: boolean | null;
  servicePackages: ServicePackage[];
  isError: boolean | null;
};
export const initialState: ServiceStateType = {
  isLoading: false,
  isError: false,
  servicePackages: [],
};

export const getAllServices = createAsyncThunk("service/getAllServices", async () => {
  try {
    const response = await myAxios.get(`/booking/servicepackage?page=1&size=100&isAscending=false`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching service:", error);
    throw error;
  }
});

const serviceSlice = createSlice({
  name: "listService",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllServices.pending, (state) => {
        state.isLoading = true;

        state.isError = null;
      })
      .addCase(getAllServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servicePackages = action.payload; // lam theo cai ta return
        state.isError = null;
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.isLoading = false;

        state.isError = true;
      });
  },
});

export default serviceSlice.reducer;
