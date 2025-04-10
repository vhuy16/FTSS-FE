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
    orderId: string | null;
    bookingCode: string | null;
    orderCode: string | null;
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
    services: Service[];
    bookingCode: string;
    missionStatus: string | null;
};
export type Service = {
    id: string;
    serviceName: string;
    price: number;
};
type MissionType = {
    isLoading: boolean;
    isLoadingGetAllMission: boolean;
    isLoadingGetAllBooking: boolean;
    isLoadingGetAllService: boolean;
    isLoadingCancelBooking: boolean;
    isLoadingUpdate: boolean;
    isLoadingAssignBooking: boolean;
    listMission: Mission[];
    listBooking: Booking[];
    booking: Booking | null;
    listService: Service[];
    listTechnician: Technician[];
    isError: boolean;
};
const initialState: MissionType = {
    isLoading: false,
    isLoadingGetAllMission: false,
    isLoadingGetAllBooking: false,
    isLoadingGetAllService: false,
    isLoadingCancelBooking: false,
    isLoadingUpdate: false,
    isLoadingAssignBooking: false,
    listMission: [],
    listService: [],
    listTechnician: [],
    listBooking: [],
    booking: null,
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
export const assignBooking = createAsyncThunk('mission/assignBooking', async (data: any, { rejectWithValue }) => {
    try {
        const response = await myAxios.post(`/booking/assign-booking`, data);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        return rejectWithValue(errorMessage);
    }
});
export const assignBookingOrder = createAsyncThunk(
    'mission/assignBookingOrder',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await myAxios.post(`/booking`, data);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            return rejectWithValue(errorMessage);
        }
    },
);
export const getAllBooking = createAsyncThunk('mission/getAllBooking', async () => {
    try {
        const response = await myAxios.get(`/booking?page=1&size=100&isAscending=false`);
        return response.data.data;
    } catch (error: any) {
        console.log(error);
    }
});
export const getAllService = createAsyncThunk('mission/getAllService', async () => {
    try {
        const response = await myAxios.get(`/booking/servicepackage?page=1&size=100`);
        return response.data.data;
    } catch (error: any) {
        console.log(error);
    }
});
export const getBookingById = createAsyncThunk('mission/getBookingById', async (id: string) => {
    try {
        const response = await myAxios.get(`/booking/${id}`);
        return response.data.data;
    } catch (error: any) {
        console.log(error);
    }
});
export const updateMission = createAsyncThunk(
    'mission/updateMission',
    async ({ formData, id }: { formData: FormData; id: string }, { dispatch, rejectWithValue }) => {
        try {
            const response = await myAxios.put(`/booking/update-mission/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await dispatch(getAllMission());
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            return rejectWithValue(errorMessage);
        }
    },
);
export const cancelBooking = createAsyncThunk(
    'mission/cancelBooking',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await myAxios.put(`/booking/cancel-booking/${id}`);
            await dispatch(getAllMission());
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            return rejectWithValue(errorMessage);
        }
    },
);

const missionSlice = createSlice({
    name: 'mission',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllMission.pending, (state) => {
                state.isLoadingGetAllMission = true;
                state.isError = false;
            })
            .addCase(getAllMission.fulfilled, (state, action) => {
                state.isLoadingGetAllMission = false;
                state.listMission = action.payload;
                state.isError = false;
            })
            .addCase(getAllMission.rejected, (state, action) => {
                state.isLoadingGetAllMission = false;
                state.isError = true;
            });
        builder
            .addCase(getAlltechnician.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAlltechnician.fulfilled, (state, action) => {
                state.isLoading = false;
                state.listTechnician = action.payload;
                state.isError = false;
            })
            .addCase(getAlltechnician.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getAllBooking.pending, (state) => {
                state.isLoadingGetAllBooking = true;
                state.isError = false;
            })
            .addCase(getAllBooking.fulfilled, (state, action) => {
                state.isLoadingGetAllBooking = false;
                state.listBooking = action.payload;
                state.isError = false;
            })
            .addCase(getAllBooking.rejected, (state, action) => {
                state.isLoadingGetAllBooking = false;
                state.isError = true;
            });
        builder
            .addCase(getAllService.pending, (state) => {
                state.isLoadingGetAllService = true;
                state.isError = false;
            })
            .addCase(getAllService.fulfilled, (state, action) => {
                state.isLoadingGetAllService = false;
                state.listService = action.payload;
                state.isError = false;
            })
            .addCase(getAllService.rejected, (state, action) => {
                state.isLoadingGetAllService = false;
                state.isError = true;
            });
        builder
            .addCase(assignBooking.pending, (state) => {
                state.isLoadingAssignBooking = true;
                state.isError = false;
            })
            .addCase(assignBooking.fulfilled, (state, action) => {
                state.isLoadingAssignBooking = false;
                state.isError = false;
            })
            .addCase(assignBooking.rejected, (state, action) => {
                state.isLoadingAssignBooking = false;
                state.isError = true;
            });
        builder
            .addCase(assignBookingOrder.pending, (state) => {
                state.isLoadingAssignBooking = true;
                state.isError = false;
            })
            .addCase(assignBookingOrder.fulfilled, (state, action) => {
                state.isLoadingAssignBooking = false;
                state.isError = false;
            })
            .addCase(assignBookingOrder.rejected, (state, action) => {
                state.isLoadingAssignBooking = false;
                state.isError = true;
            });
        builder
            .addCase(getBookingById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getBookingById.fulfilled, (state, action) => {
                state.booking = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(getBookingById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(updateMission.pending, (state) => {
                state.isLoadingUpdate = true;
                state.isError = false;
            })
            .addCase(updateMission.fulfilled, (state, action) => {
                state.isLoadingUpdate = false;
                state.isError = false;
            })
            .addCase(updateMission.rejected, (state, action) => {
                state.isLoadingUpdate = false;
                state.isError = true;
            });
        builder
            .addCase(cancelBooking.pending, (state) => {
                state.isLoadingCancelBooking = true;
                state.isError = false;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.isLoadingCancelBooking = false;
                state.isError = false;
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.isLoadingCancelBooking = false;
                state.isError = true;
            });
    },
});

export default missionSlice.reducer;
