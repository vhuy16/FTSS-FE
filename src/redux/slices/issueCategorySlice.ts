import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';
export type IssueCategory = {
    id: string;
    issueCategoryName: string;
    isDelete: boolean;
    description: string;
    createDate: string;
    modifyDate: string;
    issues: [];
};
type BankType = {
    isLoading: boolean;
    isLoadingAdd: boolean;
    isLoadingEdit: boolean;
    isLoadingDelete: boolean;
    isLoadingActive: boolean;
    isError: boolean;
    listIssueCategory: IssueCategory[];
    selectedIssueCategory: IssueCategory;
};
const initialState: BankType = {
    isLoading: false,
    isLoadingAdd: false,
    isLoadingEdit: false,
    isLoadingDelete: false,
    isLoadingActive: false,
    isError: false,
    listIssueCategory: [],
    selectedIssueCategory: {
        id: '',
        issueCategoryName: '',
        isDelete: false,
        description: '',
        createDate: '',
        modifyDate: '',
        issues: [],
    },
};
export const getIssueCategorySlice = createAsyncThunk(
    'issueCategory/getIssueCategorySlice',
    async (_, { rejectWithValue }) => {
        try {
            const response = await myAxios.get('/issue-category');
            return response.data.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);
export const addIssueCategory = createAsyncThunk(
    'issueCategory/addIssueCategory',
    async (data: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await myAxios.post('/issue-category', data);
            await dispatch(getIssueCategorySlice());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);
export const editIssueCategory = createAsyncThunk(
    'issueCategory/editIssueCategory',
    async ({ id, data }: { id: string; data: any }, { rejectWithValue, dispatch }) => {
        try {
            const response = await myAxios.put(`/issue-category/${id}`, data);
            await dispatch(getIssueCategorySlice());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);
export const deleteIssueCategory = createAsyncThunk(
    'issueCategory/deleteIssueCategory',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await myAxios.delete(`/issue-category/${id}`);
            await dispatch(getIssueCategorySlice());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);
export const activeIssueCategory = createAsyncThunk(
    'issueCategory/activeIssueCategory',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await myAxios.put(`/issue-category/${id}/enable`);
            await dispatch(getIssueCategorySlice());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);

const IssueCategorySlice = createSlice({
    name: 'IssueCategory',
    initialState,
    reducers: {
        selectIssueCategory: (state, action: PayloadAction<IssueCategory>) => {
            const issueCategory = action.payload;
            state.selectedIssueCategory = issueCategory;
        },
    },
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
        builder
            .addCase(addIssueCategory.pending, (state) => {
                state.isLoadingAdd = true;
                state.isError = false;
            })
            .addCase(addIssueCategory.fulfilled, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = false;
            })
            .addCase(addIssueCategory.rejected, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = true;
            });
        builder
            .addCase(editIssueCategory.pending, (state) => {
                state.isLoadingEdit = true;
                state.isError = false;
            })
            .addCase(editIssueCategory.fulfilled, (state, action) => {
                state.isLoadingEdit = false;
                state.isError = false;
            })
            .addCase(editIssueCategory.rejected, (state, action) => {
                state.isLoadingEdit = false;
                state.isError = true;
            });
        builder
            .addCase(deleteIssueCategory.pending, (state) => {
                state.isLoadingDelete = true;
                state.isError = false;
            })
            .addCase(deleteIssueCategory.fulfilled, (state, action) => {
                state.isLoadingDelete = false;
                state.isError = false;
            })
            .addCase(deleteIssueCategory.rejected, (state, action) => {
                state.isLoadingDelete = false;
                state.isError = true;
            });
        builder
            .addCase(activeIssueCategory.pending, (state) => {
                state.isLoadingActive = true;
                state.isError = false;
            })
            .addCase(activeIssueCategory.fulfilled, (state, action) => {
                state.isLoadingActive = false;
                state.isError = false;
            })
            .addCase(activeIssueCategory.rejected, (state, action) => {
                state.isLoadingActive = false;
                state.isError = true;
            });
    },
});
export const { selectIssueCategory } = IssueCategorySlice.actions;
export default IssueCategorySlice.reducer;
