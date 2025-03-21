import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

type DataCheckOut = {
    cartItem: string[];
    shipCost: number;
    address: string;
    voucherId: string | null;
    paymentMethod: string;
    phoneNumber: string;
    recipientName: string;
    setupPackageId: string | null;
};
type UserResponse = {
    name: string;
    email: string;
    phoneNumber: string;
};
type Payment = {
    paymentMethod: string | null;
    paymentStatus: string | null;
};

type OrderDetail = {
    productName: string;
    price: number;
    quantity: number;
    linkImage: string;
    categoryName: string;
    subCategoryName: string;
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
    payment: Payment;
};
type initialStateProduct = {
    url: string;
    listOrder: Order[];
    order: Order | null;
    isLoading: boolean;
    isLoadingUpdate: boolean;
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
        const response = await myAxios.get('/order?page=1&size=100&isAscending=false');
        return response.data.data.orders;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy đơn hàng thất bại');
    }
});
export const getOrderById = createAsyncThunk('order/getOrderById', async (id: string, { rejectWithValue }) => {
    try {
        const response = await myAxios.get(`/order/${id}`);
        return response.data.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy đơn hàng theo id thất bại');
    }
});
export const updateOrder = createAsyncThunk(
    'order/updateOrder',
    async ({ id, status }: { id: string; status: string }, { rejectWithValue, dispatch }) => {
        try {
            const response = await myAxios.put(`/order/${id}`, { status: status });
            await dispatch(getAllOrder());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Cập nhật đơn hàng thất bại');
        }
    },
);

const initialState: initialStateProduct = {
    url: '',
    listOrder: [],
    order: null,
    isLoading: false,
    isLoadingUpdate: false,
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
        builder
            .addCase(getOrderById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.order = action.payload;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(updateOrder.pending, (state) => {
                state.isLoadingUpdate = true;
                state.isError = false;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.isLoadingUpdate = false;
                state.isError = false;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.isLoadingUpdate = false;
                state.isError = true;
            });
    },
});
export default orderSlice.reducer;
