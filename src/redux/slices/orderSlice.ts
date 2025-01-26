import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

type initialStateProduct = {
    url: string;
    isLoading: boolean;
    isError: boolean;
};
type DataCheckOut = {
    CartItem: string[];
    ShipCost: number;
    Address: string;
    VoucherId: string;
    PaymentMethod: string;
};
export const createOrder = createAsyncThunk('order/create', async (data: DataCheckOut, { rejectWithValue }) => {
    try {
        const response = await myAxios.post('/order', data);
        return response.data.data.checkoutUrl;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Tạo đơn hàng thất bại');
    }
});

const initialState: initialStateProduct = {
    url: '',
    isLoading: false,
    isError: false,
};

const orderSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.url = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});
export default orderSlice.reducer;
