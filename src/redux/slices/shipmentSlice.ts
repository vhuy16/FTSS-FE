import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';
import axios from 'axios';
type Report = {
    success_percent?: number;
    return_percent?: number;
    avg_time_delivery: number;
    avg_time_delivery_format: number;
};
type ShippingCost = {
    id: string;
    carrier_name: string;
    carrier_logo: string;
    carrier_short_name: string;
    service: string;
    expected: string;
    is_apply_only: boolean;
    promotion_id: number;
    discount: number;
    weight_fee: number;
    location_first_fee: number;
    location_step_fee: number;
    remote_area_fee: number;
    oil_fee: number;
    location_fee: number;
    cod_fee: number;
    service_fee: number;
    total_fee: number;
    total_amount: number;
    total_amount_carrier: number;
    total_amount_shop: number;
    price_table_id: number;
    insurrance_fee: number;
    return_fee: number;
    report: Report;
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
export const createShipment = createAsyncThunk(
    'shipment/createShipment',
    async ({ district, city, amount }: { district: string; city: string; amount: number }) => {
        try {
            const response = await axios.post(
                'https://sandbox.goship.io/api/v2/rates',
                {
                    shipment: {
                        address_from: {
                            district: '720300',
                            city: '700000',
                        },
                        address_to: {
                            district: district,
                            city: city,
                        },
                        parcel: {
                            amount: amount,
                            width: 10,
                            height: 10,
                            length: 10,
                            weight: 1000,
                        },
                    },
                },
                {
                    headers: {
                        Authorization:
                            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNiMWUwZDlkYzhiYzUxZmJkOTA1MDI4NzQ4MTMxOTJmMmFhYzBhNTk0MzE1M2Y5ZGRiNzdhZDdkZGU5ODg5NDhmZWQ0ODk1OGE3NTNjNGExIn0.eyJhdWQiOiIxMyIsImp0aSI6IjNiMWUwZDlkYzhiYzUxZmJkOTA1MDI4NzQ4MTMxOTJmMmFhYzBhNTk0MzE1M2Y5ZGRiNzdhZDdkZGU5ODg5NDhmZWQ0ODk1OGE3NTNjNGExIiwiaWF0IjoxNzM5NDk5NDIzLCJuYmYiOjE3Mzk0OTk0MjMsImV4cCI6MjA1NTAzMjIyMywic3ViIjoiMzUxNSIsInNjb3BlcyI6W119.fNiGQkOJWhpKjLDNbsWV8kcQ5THdCEQ00xYrv89x9zgxH7hwX7iBZW-4-SmFpSh6ITZEukxp0MsqG7bJlH0-7NmcWB4iKyJJVbtFUb_NnXQyibc5aJYpEicEkZDwnbkW385Oe_M5pXlr7UY-pzMMNRKlyrKyGXG_edvQQxRpecO1QVDqvrOp5LSbi7j0EcabCrUmjbIj0L7hm1xGHHuk_-YW6I3eK7nttkkKMUi7YRbV3T3s8vO6MFOt1dLZ7Zq05QwWsRtSbH7aGnqb1T1hA6v4pF_87phUSjXZ-WKlRHmLaxMYN9fz56jHnqnfIcKUh89JIjfOxRNZFoGbVgeTxWxc4lFqak35Qc5AlValSI13Spzn7wvl8FR_sK3U9wtfMOSSGIRAJmQzLL7SJaGZiuJ7dt9ODuL6EJ4fyu4X-Z2wqw9KG57j_ezbd9jUCzj9wrDj-2A1srPw5ZW--0ohKa-_5OR2WAKinnGGVEHMp8CS5_v4469jPitb_U3cO94xc2EWaXgPDCU7bggIdx_T4xz_RJDlPnt-_27ygZIu5lKbDLfWURdao1xFP_1akOSEfbOMDnXT-hKnRrUk6tiuJmdaqr_gfDl8sxdQQsN2ft12gg4I1_Vo7yQw47givWz3XLlgffFXZY71znxvuFQIxn6aZ-vrlA-ZKzUVmm-dLFE',
                    },
                },
            );
            return response.data.data[0];
        } catch (error: any) {
            console.error('Error create shipment:', error);
            throw error;
        }
    },
);

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
