import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';
type SubCategory = {
    id: string;
    subCategoryName: string;
    categoryId: string;
    description: string;
    createDate: string;
    modifyDate: string;
};
type categoryType = {
    categoryName: string;
    id: string;
    description: string;
    image: string;
    createDate: string;
    modifyDate: string;
    subCategories: SubCategory[] | null;
};

export const getAllCategory = createAsyncThunk('user/getAllCategory', async () => {
    const response = await myAxios.get('https://ftss.id.vn/api/v1/category?page=1&size=100');
    return response.data.data.items;
});

type CategoryState = {
    isLoading: boolean;
    categories: categoryType[] | null;
    isError: boolean;
};

const initialState: CategoryState = {
    isLoading: false,
    categories: null,
    isError: false,
};

const ListCategorySlice = createSlice({
    name: 'listCategory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategory.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
                state.isError = false;
            })
            .addCase(getAllCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});

export default ListCategorySlice.reducer;
