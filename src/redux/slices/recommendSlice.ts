import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

export interface RecommendationItem {
  id: string;
  productName: string;
  price: number;
  size: string;
  description: string;
  subCategoryName: string;
  categoryName: string;
  images: [];
  power: number;
}

export interface Recommendations {
  filters?: RecommendationItem[];
  lights?: RecommendationItem[];
  substrates?: RecommendationItem[];
  otherProducts?: RecommendationItem[];
}

interface RecommendState {
  recommendations: Recommendations | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecommendState = {
  recommendations: null,
  loading: false,
  error: null,
};

export const getRecommendations = createAsyncThunk(
  "recommend/getRecommendations",
  async (data: { size: string }, { rejectWithValue }) => {
    try {
      const response = await myAxios.post("/recommend-products", data);
      return response.data.data.recommendations;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Đã xảy ra lỗi");
    }
  }
);

const recommendSlice = createSlice({
  name: "recommend",
  initialState,
  reducers: {
    clearRecommendations(state) {
      state.recommendations = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
        state.loading = false;
      })
      .addCase(getRecommendations.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearRecommendations } = recommendSlice.actions;
export default recommendSlice.reducer;
