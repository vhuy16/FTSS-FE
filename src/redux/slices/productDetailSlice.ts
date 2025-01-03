import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';
import { Product } from './productSlice';

type initialStateProduct = {
    data: Product | null;
    isLoading: boolean;
    isError: boolean;
};

export const getProductDetail = createAsyncThunk(
    'product/getProductDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await myAxios.get(`/product/${id}`);
            return response.data.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Lấy sản phẩm chi tiết thất bại');
        }
    },
);

const initialState: initialStateProduct = {
    data: null,
    isLoading: false,
    isError: false,
};

const productDetailSlice = createSlice({
    name: 'productDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProductDetail.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getProductDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.data = action.payload;
            })
            .addCase(getProductDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});
export default productDetailSlice.reducer;
