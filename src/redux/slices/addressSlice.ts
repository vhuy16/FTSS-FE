import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllProvince = createAsyncThunk("address/getAllProvince", async () => {
  const response = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
  return response.data.data;
});
export const getAllDistrict = createAsyncThunk("address/getAllDistrict", async (id: string) => {
  const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${id}.htm`);
  return response.data.data;
});
type Province = {
  id: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  latitude: string;
  longitude: string;
};
type ProvinceState = {
  listProvince: Province[];
  listDistrict: Province[];
  isLoading: boolean;
  isError: boolean;
};
const initialState: ProvinceState = {
  listProvince: [],
  listDistrict: [],
  isLoading: false,
  isError: false,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProvince.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllProvince.fulfilled, (state, action: PayloadAction<Province[]>) => {
        state.isLoading = false;
        state.isError = false;
        state.listProvince = action.payload;
      })
      .addCase(getAllProvince.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(getAllDistrict.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllDistrict.fulfilled, (state, action: PayloadAction<Province[]>) => {
        state.isLoading = false;
        state.isError = false;
        state.listDistrict = action.payload;
      })
      .addCase(getAllDistrict.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default addressSlice.reducer;
