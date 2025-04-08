import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
export type IssueCategory = {
  id: string;
  issueCategoryName: string;
  isDelete: string;
  description: string;
  createDate: string;
  modifyDate: string;
  issues: [];
};
type BankType = {
  isLoading: boolean;
  isError: boolean;
  listIssueCategory: IssueCategory[];
};
const initialState: BankType = {
  isLoading: false,
  isError: false,
  listIssueCategory: [],
};
export const getIssueCategorySlice = createAsyncThunk("issueCategory/getIssueCategorySlice", async () => {
  const response = await myAxios.get("/issue-category");
  return response.data.data;
});

const IssueCategorySlice = createSlice({
  name: "IssueCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIssueCategorySlice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getIssueCategorySlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.listIssueCategory = action.payload;
      })
      .addCase(getIssueCategorySlice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default IssueCategorySlice.reducer;
