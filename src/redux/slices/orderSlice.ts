import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

type DataCheckOut = {
    cartItem: string[];
    shipCost: number;
    address: string;
    voucherId: string | null;
    paymentMethod: string;
    phoneNumber: string;
    name: string;
};
type UserResponse = {
    name: string;
    email: string;
    phoneNumber: string;
};

type OrderDetail = {
    productName: string;
    price: number;
    quantity: number;
    linkImage: string;
};

type Order = {
    id: string;
    totalPrice: number;
    status: string;
    shipCost: number;
    createDate: string;
    modifyDate: string | null;
    address: string;
    phoneNumber: string | null;
    buyerName: string | null;
    discount: number;
    userResponse: UserResponse;
    orderDetails: OrderDetail[];
};
type initialStateProduct = {
    url: string;
    listOrder: Order[];
    isLoading: boolean;
    isError: boolean;
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
export const getAllOrder = createAsyncThunk('order/getAllOrder', async (_, { rejectWithValue }) => {
    try {
        const response = await myAxios.get('/order?page=1&size=100');
        return response.data.data.orders;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy đơn hàng thất bại');
    }
});

const initialState: initialStateProduct = {
    url: '',
    listOrder: [],
    isLoading: false,
    isError: false,
};

const orderSlice = createSlice({
    name: 'order',
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
        builder
            .addCase(getAllOrder.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listOrder = action.payload;
            })
            .addCase(getAllOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});
export default orderSlice.reducer;
