import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';
type Statistic = {
    value: number;
    changePercentage: string;
};

type DashboardStats = {
    revenue: Statistic;
    orders: Statistic;
    productsSold: Statistic;
    users: Statistic;
};
type FinancialValueStats = {
    name: string;
    value: number;
};
type RevenueData = {
    day: string; // Ngày ở định dạng "DD/MM/YYYY"
    revenue: number;
};
type ProductSalesData = {
    category: string;
    productQuantity: number;
};

export const getDashboard = createAsyncThunk('dashboard/getDashboard', async (_, { rejectWithValue }) => {
    try {
        const response = await myAxios.get('/monthly');
        return response.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy doanh thu thất bại');
    }
});
export const getFinancial = createAsyncThunk('dashboard/getFinancial', async (_, { rejectWithValue }) => {
    try {
        const response = await myAxios.get('/financial-statistics');
        return response.data.statistics;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy doanh thu thất bại');
    }
});
export const getDataChartTwo = createAsyncThunk(
    'dashboard/getDataChartTwo',
    async ({ startDay, endDay }: { startDay: string; endDay: string }, { rejectWithValue }) => {
        try {
            const response = await myAxios.get(`/category-sales?startDay=${startDay}&endDay=${endDay}`);
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Lấy doanh thu thất bại');
        }
    },
);
export const getDataChartOne = createAsyncThunk(
    'dashboard/getDataChartOne',
    async ({ startDay, endDay }: { startDay: string; endDay: string }, { rejectWithValue }) => {
        try {
            const response = await myAxios.get(`/revenue?startDay=${startDay}&endDay=${endDay}`);
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Lấy doanh thu thất bại');
        }
    },
);

type CategoryState = {
    isLoadingDashboard: boolean;
    isLoadingChartOne: boolean;
    isLoadingChartTwo: boolean;
    isLoadingFinancial: boolean;
    isError: boolean;
    dashboardValue: DashboardStats;
    financialValue: FinancialValueStats[];
    dataChartOne: RevenueData[];
    dataChartTwo: ProductSalesData[];
};

const initialState: CategoryState = {
    isLoadingDashboard: false,
    isLoadingChartOne: false,
    isLoadingChartTwo: false,
    isLoadingFinancial: false,
    isError: false,
    dashboardValue: {
        revenue: { value: 0, changePercentage: '' },
        orders: { value: 0, changePercentage: '' },
        productsSold: { value: 0, changePercentage: '' },
        users: { value: 0, changePercentage: '' },
    },
    financialValue: [],
    dataChartOne: [],
    dataChartTwo: [],
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDashboard.pending, (state) => {
                state.isLoadingDashboard = true;
                state.isError = false;
            })
            .addCase(getDashboard.fulfilled, (state, action) => {
                state.isLoadingDashboard = false;
                state.dashboardValue = action.payload;
                state.isError = false;
            })
            .addCase(getDashboard.rejected, (state, action) => {
                state.isLoadingDashboard = false;
                state.isError = true;
            });
        builder
            .addCase(getDataChartOne.pending, (state) => {
                state.isLoadingChartOne = true;
                state.isError = false;
            })
            .addCase(getDataChartOne.fulfilled, (state, action) => {
                state.isLoadingChartOne = false;
                state.dataChartOne = action.payload;
                state.isError = false;
            })
            .addCase(getDataChartOne.rejected, (state, action) => {
                state.isLoadingChartOne = false;
                state.isError = true;
            });
        builder
            .addCase(getDataChartTwo.pending, (state) => {
                state.isLoadingChartTwo = true;
                state.isError = false;
            })
            .addCase(getDataChartTwo.fulfilled, (state, action) => {
                state.isLoadingChartTwo = false;
                state.dataChartTwo = action.payload;
                state.isError = false;
            })
            .addCase(getDataChartTwo.rejected, (state, action) => {
                state.isLoadingChartTwo = false;
                state.isError = true;
            });
        builder
            .addCase(getFinancial.pending, (state) => {
                state.isLoadingFinancial = true;
                state.isError = false;
            })
            .addCase(getFinancial.fulfilled, (state, action) => {
                state.isLoadingFinancial = false;
                state.financialValue = action.payload;
                state.isError = false;
            })
            .addCase(getFinancial.rejected, (state, action) => {
                state.isLoadingFinancial = false;
                state.isError = true;
            });
    },
});

export default dashboardSlice.reducer;
