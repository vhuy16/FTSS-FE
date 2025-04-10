import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

export type Issue = {
  id: string;
  title: string;
  description: string;
  issueCategoryId: string;
  issueImage: string;
  issueCategoryName: string;
  createDate: string;
  modifiedDate: string;
  isDelete: boolean;
  solutions: Solution[];
};
type Product = {
  productId: string;
  productName: string;
  productDescription: string;
  productImageUrl: string;
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

type initialStateIssue = {
  data: IssueData | null;
  selectedIssue: Issue;
  listIssue: Issue[];
  isLoading: boolean;
  isLoadingAdd: boolean;
  isLoadingDelete: boolean;
  isLoadingEdit: boolean;
  isLoadingActive: boolean;
  isError: boolean;
  issueDetail: Issue | null;
};
const initialState: initialStateIssue = {
  data: null,
  selectedIssue: {
    id: "",
    title: "",
    description: "",
    issueCategoryId: "",
    issueImage: "",
    issueCategoryName: "",
    createDate: "",
    modifiedDate: "",
    isDelete: false,
    solutions: [],
  },
  listIssue: [],
  isLoading: false,
  isLoadingAdd: false,
  isLoadingEdit: false,
  isLoadingDelete: false,
  isLoadingActive: false,
  isError: false,
  issueDetail: null,
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
export const getIssue = createAsyncThunk("issue/getIssue", async (_, { rejectWithValue }) => {
  try {
    const response = await myAxios.get("/issue?page=1&size=100");
    return response.data.data.items;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Something went wrong");
  }
});
export const getDetailIssue = createAsyncThunk("issue/getDetailIssue", async (id: string, { rejectWithValue }) => {
  try {
    const response = await myAxios.get(`/issue/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Lấy sản phẩm chi tiết thất bại");
  }
});
export const addIssue = createAsyncThunk(
  "issue/addIssue",
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await myAxios.post(`/issue`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await dispatch(getIssue());
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Thêm vấn đề thất bại");
    }
  }
);
export const editIssue = createAsyncThunk(
  "issue/editIssue",
  async ({ id, formData }: { id: string; formData: FormData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await myAxios.put(`/issue/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await dispatch(getIssue());
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Thêm vấn đề thất bại");
    }
  }
);
export const deleteIssue = createAsyncThunk("issue/deleteIssue", async (id: string, { rejectWithValue, dispatch }) => {
  try {
    const response = await myAxios.delete(`/issue/${id}`);
    await dispatch(getIssue());
    return response.data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Something went wrong");
  }
});
export const activeIssue = createAsyncThunk("issue/activeIssue", async (id: string, { rejectWithValue, dispatch }) => {
  try {
    const response = await myAxios.put(`/issue/${id}/enable`);
    await dispatch(getIssue());
    return response.data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Something went wrong");
  }
});

const IssueSlice = createSlice({
  name: "issue",
  initialState,
  reducers: {
    selectIssue: (state, action: PayloadAction<Issue>) => {
      const issue = action.payload;
      state.selectedIssue = issue;
    },
  },
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
      .addCase(getIssue.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.listIssue = action.payload;
      })
      .addCase(getIssue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(addIssue.pending, (state) => {
        state.isLoadingAdd = true;
        state.isError = false;
      })
      .addCase(addIssue.fulfilled, (state, action) => {
        state.isLoadingAdd = false;
        state.isError = false;
      })
      .addCase(addIssue.rejected, (state, action) => {
        state.isLoadingAdd = false;
        state.isError = true;
      });
    builder
      .addCase(editIssue.pending, (state) => {
        state.isLoadingEdit = true;
        state.isError = false;
      })
      .addCase(editIssue.fulfilled, (state, action) => {
        state.isLoadingEdit = false;
        state.isError = false;
      })
      .addCase(editIssue.rejected, (state, action) => {
        state.isLoadingEdit = false;
        state.isError = true;
      });
    builder
      .addCase(deleteIssue.pending, (state) => {
        state.isLoadingDelete = true;
        state.isError = false;
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.isLoadingDelete = false;
        state.isError = false;
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.isLoadingDelete = false;
        state.isError = true;
      });
    builder
      .addCase(activeIssue.pending, (state) => {
        state.isLoadingActive = true;
        state.isError = false;
      })
      .addCase(activeIssue.fulfilled, (state, action) => {
        state.isLoadingActive = false;
        state.isError = false;
      })
      .addCase(activeIssue.rejected, (state, action) => {
        state.isLoadingActive = false;
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
export const { selectIssue } = IssueSlice.actions;
export default IssueSlice.reducer;
