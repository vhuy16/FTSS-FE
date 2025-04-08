import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
import { Product } from "./productSlice";

export type Issue = {
  id: string;
  title: string;
  description: string;
  issueCategoryId: string;
  issueImage: string;
  issueCategoryName: string;
  createDate: string;
  modifiedDate: string;
  solutions: [];
};
export type Solution = {
  id: string;
  solutionName: string;
  description: string;
  createDate: string;
  modifiedDate: string;
  products: Product[];
};
type IssueData = {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Issue[];
  solutionCount: number;
  productCount: number;
};

type initialStateProduct = {
  data: IssueData | null;
  isLoading: boolean;
  isError: boolean;
};

export const getAllIssue = createAsyncThunk(
  "issue/getAll",
  async (
    {
      page,
      size,
      issueCategoryId,
      isAscending,
    }: { page?: number; size?: number; issueCategoryId?: string; isAscending?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const baseUrl = "/issue";
      let url = `${baseUrl}?page=${page}&size=${size}`;

      if (issueCategoryId) {
        url += `&issueCategoryId=${issueCategoryId}`;
      }
      if (isAscending !== undefined) {
        url += `&isAscending=${isAscending}`;
      }

      const response = await myAxios.get(url);
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lấy sản phẩm thất bại");
    }
  }
);

const initialState: initialStateProduct = {
  data: null,
  isLoading: false,
  isError: false,
};

const IssueSlice = createSlice({
  name: "issue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllIssue.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      })
      .addCase(getAllIssue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default IssueSlice.reducer;
