import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllProvince = createAsyncThunk('address/getAllProvince', async () => {
    const response = await axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        headers: {
            token: '95077904-e10a-11ef-b2e4-6ec7c647cc27', // Token GHN
        },
    });
    return response.data.data;
});
export const getAllDistrict = createAsyncThunk('address/getAllDistrict', async (id: string) => {
    const response = await axios.get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${id}`,
        {
            headers: {
                token: '95077904-e10a-11ef-b2e4-6ec7c647cc27', // Token GHN
            },
        },
    );
    return response.data.data;
});
type Province = {
    ProvinceID: number;
    ProvinceName: string;
    CountryID: number;
    Code: string;
    NameExtension: string[];
    IsEnable: number;
    RegionID: number;
    RegionCPN: number;
    UpdatedBy: number;
    CreatedAt: string;
    UpdatedAt: string;
    AreaID?: number; // Có trong Lào Cai nhưng không có trong các tỉnh khác
    CanUpdateCOD: boolean;
    Status: number;
    UpdatedIP?: string; // Chỉ có trong Lào Cai
    UpdatedEmployee?: number; // Chỉ có trong Lào Cai
    UpdatedSource?: string; // Chỉ có trong Lào Cai
    UpdatedDate?: string; // Chỉ có trong Lào Cai
};
type District = {
    DistrictID: number;
    ProvinceID: number;
    DistrictName: string;
    Code: string;
    Type: number;
    SupportType: number;
    NameExtension: string[];
    IsEnable: number;
    UpdatedBy: number;
    CreatedAt: string;
    UpdatedAt: string;
    CanUpdateCOD: boolean;
    Status: number;
    PickType: number;
    DeliverType: number;
    WhiteListClient: {
        From: any[];
        To: any[];
        Return: any[];
    };
    WhiteListDistrict: {
        From: any | null;
        To: any | null;
    };
    ReasonCode: string;
    ReasonMessage: string;
    OnDates: any | null;
    UpdatedEmployee: number;
    UpdatedDate: string;
};

type ProvinceState = {
    listProvince: Province[];
    listDistrict: District[];
    isLoading: boolean;
    isError: boolean;
};
const initialState: ProvinceState = {
    listProvince: [],
    listDistrict: [],
    isLoading: false,
    isError: false,
};

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProvince.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllProvince.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listProvince = action.payload;
            })
            .addCase(getAllProvince.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getAllDistrict.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllDistrict.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listDistrict = action.payload;
            })
            .addCase(getAllDistrict.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});
export default addressSlice.reducer;
