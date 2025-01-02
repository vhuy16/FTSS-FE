import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

export type Product = {
    id: string;
    productName: string;
    description: string;
    quantity: number;
    subCategoryName: string;
    categoryName: string;
    price: number;
    status: string;
    images: string[];
};

type ProductData = {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: Product[];
};
type initialStateProduct = {
    data: ProductData | null;
    isLoading: boolean;
    isError: boolean;
};

export const getAllProduct = createAsyncThunk(
    'product/getAll',
    async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
        try {
            const baseUrl = '/product';
            const url = page && size ? `${baseUrl}?page=${page}&size=${size}` : baseUrl;
            const response = await myAxios.get(url);
            return response.data.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Lấy sản phẩm thất bại');
        }
    },
);

const initialState: initialStateProduct = {
    data: null,
    isLoading: false,
    isError: false,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProduct.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.data = action.payload;
            })
            .addCase(getAllProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});
export default productSlice.reducer;
