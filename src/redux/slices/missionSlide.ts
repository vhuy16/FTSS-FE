import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

export type Mission = {
    id: string;
    missionName: string;
    missionDescription: string;
    status: string;
    missionSchedule: string;
    address: string | null;
    phoneNumber: string | null;
    technicianId: string;
    technicianName: string;
    bookingId: string | null;
};
export type Technician = {
    techId: string;
    techName: string;
    fullName: string;
};
export type Booking = {
    id: string;
    scheduleDate: string;
    status: string;
    address: string;
    phoneNumber: string | null;
    totalPrice: number;
    userId: string;
    userName: string;
    fullName: string;
    orderId: string;
    isAssigned: boolean;
};
type MissionType = {
    isLoading: boolean | null;
    isLoadingAssignBooking: boolean | null;
    listMission: Mission[];
    listBooking: Booking[];
    listTechnician: Technician[];
    isError: boolean | null;
};
const initialState: MissionType = {
    isLoading: false,
    isLoadingAssignBooking: false,
    listMission: [],
    listTechnician: [],
    listBooking: [],
    isError: false,
};

export const getAllMission = createAsyncThunk('mission/getAllMission', async () => {
    try {
        const response = await myAxios.get(`/booking/list-mission-manager?page=1&size=100`);
        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
});
export const getAlltechnician = createAsyncThunk('mission/getAlltechnician', async (data: any) => {
    try {
        const response = await myAxios.post(`/booking/list-tech`, data);
        return response.data.data;
    } catch (error: any) {
        console.log(error);
    }
});
export const assignBooking = createAsyncThunk('mission/assignBooking', async (data: any) => {
    try {
        const response = await myAxios.post(`/booking/assign-booking`, data);
        return response.data;
    } catch (error: any) {
        console.log(error);
    }
});
export const getAllBooking = createAsyncThunk('mission/getAllBooking', async () => {
    try {
        const response = await myAxios.get(`/booking?page=1&size=10&isAscending=false`);
        return response.data.data;
    } catch (error: any) {
        console.log(error);
    }
});

const missionSlice = createSlice({
    name: 'mission',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllMission.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(getAllMission.fulfilled, (state, action) => {
                state.isLoading = false;
                state.listMission = action.payload;
                state.isError = null;
            })
            .addCase(getAllMission.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getAlltechnician.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(getAlltechnician.fulfilled, (state, action) => {
                state.isLoading = false;
                state.listTechnician = action.payload;
                state.isError = null;
            })
            .addCase(getAlltechnician.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getAllBooking.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(getAllBooking.fulfilled, (state, action) => {
                state.isLoading = false;
                state.listBooking = action.payload;
                state.isError = null;
            })
            .addCase(getAllBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(assignBooking.pending, (state) => {
                state.isLoadingAssignBooking = true;
                state.isError = null;
            })
            .addCase(assignBooking.fulfilled, (state, action) => {
                state.isLoadingAssignBooking = false;
                state.isError = null;
            })
            .addCase(assignBooking.rejected, (state, action) => {
                state.isLoadingAssignBooking = false;
                state.isError = true;
            });
    },
});

export default missionSlice.reducer;
