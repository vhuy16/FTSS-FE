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
  solutions: Solution[];
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
  issueDetail: Issue | null;
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
      issueTitle,
    }: { page?: number; size?: number; issueCategoryId?: string; isAscending?: boolean; issueTitle?: string },
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
      if (issueTitle) {
        url += `&issueTitle=${issueTitle}`;
      }

      const response = await myAxios.get(url);
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lấy sản phẩm thất bại");
    }
  }
);
export const getDetailIssue = createAsyncThunk("issue/getDetailIssue", async (id: string, { rejectWithValue }) => {
  try {
    const response = await myAxios.get(`/issue/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Lấy sản phẩm chi tiết thất bại");
  }
});

const initialState: initialStateProduct = {
  data: null,
  issueDetail: null,
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
    builder
      .addCase(getDetailIssue.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getDetailIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.issueDetail = action.payload;
      })
      .addCase(getDetailIssue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default IssueSlice.reducer;
