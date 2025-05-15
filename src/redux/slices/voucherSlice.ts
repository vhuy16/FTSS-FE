import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

export type Voucher = {
    id: string;
    voucherCode: string;
    discount: number;
    description: string;
    status: string;
    discountType: string;
    quantity: number;
    maximumOrderValue: number;
    expiryDate: string;
    createDate: string;
    modifyDate: string;
};

type VoucherType = {
    isLoading: boolean;
    isLoadingAdd: boolean;
    isLoadingEdit: boolean;
    isLoadingDelete: boolean;
    isLoadingActive: boolean;
    isError: boolean;
    listVoucher: Voucher[];
    selectedVoucher: Voucher;
};
const initialState: VoucherType = {
    isLoading: false,
    isLoadingAdd: false,
    isLoadingEdit: false,
    isLoadingDelete: false,
    isLoadingActive: false,
    isError: false,
    listVoucher: [],
    selectedVoucher: {
        id: '',
        voucherCode: '',
        discount: 0,
        description: '',
        status: '',
        discountType: '',
        quantity: 0,
        maximumOrderValue: 0,
        expiryDate: '',
        createDate: '',
        modifyDate: '',
    },
};

export const getAllVoucher = createAsyncThunk('voucher/getAllVoucher', async (_, { rejectWithValue }) => {
    try {
        const response = await myAxios.get(`/voucher/get-all-voucher?size=10&isAscending=false`);
        return response.data.data.vouchers;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        return rejectWithValue(errorMessage);
    }
});
export const getAllVoucherUser = createAsyncThunk('voucher/getAllVoucherUser', async (_, { rejectWithValue }) => {
    try {
        const response = await myAxios.get(`/voucher?size=10&isAscending=false`);
        return response.data.data.vouchers;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        return rejectWithValue(errorMessage);
    }
});
export const addVoucher = createAsyncThunk('voucher/addVoucher', async (data: any, { dispatch, rejectWithValue }) => {
    try {
        const response = await myAxios.post(`/voucher`, data);
        await dispatch(getAllVoucher());
        return response.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
});
export const editVoucher = createAsyncThunk(
    'voucher/editVoucher',
    async ({ id, data }: { id: string; data: any }, { dispatch, rejectWithValue }) => {
        try {
            const response = await myAxios.put(`/voucher${id}`, data);
            await dispatch(getAllVoucher());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);
export const deleteVoucher = createAsyncThunk(
    'voucher/deleteVoucher',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await myAxios.put(`/voucher/update-status-voucher/${id}`, JSON.stringify('Inactive'), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            await dispatch(getAllVoucher());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);
export const activeVoucher = createAsyncThunk(
    'voucher/activeVoucher',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await myAxios.put(`/voucher/update-status-voucher/${id}`, JSON.stringify('Active'), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            await dispatch(getAllVoucher());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);

const voucherSlice = createSlice({
    name: 'voucher',
    initialState,
    reducers: {
        selectVoucher: (state, action: PayloadAction<Voucher>) => {
            const voucher = action.payload;
            state.selectedVoucher = voucher;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllVoucher.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllVoucher.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listVoucher = action.payload;
            })
            .addCase(getAllVoucher.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getAllVoucherUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllVoucherUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listVoucher = action.payload;
            })
            .addCase(getAllVoucherUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(addVoucher.pending, (state) => {
                state.isLoadingAdd = true;
                state.isError = false;
            })
            .addCase(addVoucher.fulfilled, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = false;
            })
            .addCase(addVoucher.rejected, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = true;
            });
        builder
            .addCase(editVoucher.pending, (state) => {
                state.isLoadingEdit = true;
                state.isError = false;
            })
            .addCase(editVoucher.fulfilled, (state, action) => {
                state.isLoadingEdit = false;
                state.isError = false;
            })
            .addCase(editVoucher.rejected, (state, action) => {
                state.isLoadingEdit = false;
                state.isError = true;
            });
        builder
            .addCase(deleteVoucher.pending, (state) => {
                state.isLoadingDelete = true;
                state.isError = false;
            })
            .addCase(deleteVoucher.fulfilled, (state, action) => {
                state.isLoadingDelete = false;
                state.isError = false;
            })
            .addCase(deleteVoucher.rejected, (state, action) => {
                state.isLoadingDelete = false;
                state.isError = true;
            });
        builder
            .addCase(activeVoucher.pending, (state) => {
                state.isLoadingActive = true;
                state.isError = false;
            })
            .addCase(activeVoucher.fulfilled, (state, action) => {
                state.isLoadingActive = false;
                state.isError = false;
            })
            .addCase(activeVoucher.rejected, (state, action) => {
                state.isLoadingActive = false;
                state.isError = true;
            });
    },
});
export const { selectVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
