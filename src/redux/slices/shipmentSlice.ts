import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';
import axios from 'axios';

type ShippingCost = {
    total: number;
    service_fee: number;
    insurance_fee: number;
    pick_station_fee: number;
    coupon_value: number;
    r2s_fee: number;
    return_again: number;
    document_return: number;
    double_check: number;
    cod_fee: number;
    pick_remote_areas_fee: number;
    deliver_remote_areas_fee: number;
    cod_failed_fee: number;
};

type ProfileType = {
    ship: ShippingCost | null;
    isLoading: boolean | null;
    isError: boolean | null;
};
const initialState: ProfileType = {
    ship: null,
    isLoading: false,
    isError: false,
};

// Async thunk for fetching the user profile
export const createShipment = createAsyncThunk('shipment/createShipment', async (to_district_id: number) => {
    try {
        const response = await axios.post(
            'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
            {
                service_type_id: 2,
                insurance_value: 4000000,
                coupon: null,
                from_district_id: 3695,
                to_district_id: to_district_id,
                height: 10,
                length: 20,
                weight: 5000,
                width: 20,
            },
            {
                headers: {
                    token: '95077904-e10a-11ef-b2e4-6ec7c647cc27', // Token GHN
                    ShopId: 195899,
                },
            },
        );
        return response.data.data;
    } catch (error: any) {
        console.error('Error create shipment:', error);
        throw error;
    }
});

// Assuming UserProfile is defined appropriately somewhere

const shipmentSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createShipment.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(createShipment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ship = action.payload;
                state.isError = null;
            })
            .addCase(createShipment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});

export default shipmentSlice.reducer;
