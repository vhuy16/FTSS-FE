import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

export type Service = {
    id: string;
    serviceName: string;
    price: number;
    description: string;
    isDelete: boolean;
};
type ServiceType = {
    isLoading: boolean;
    isLoadingAdd: boolean;
    isLoadingEdit: boolean;
    isLoadingDelete: boolean;
    isLoadingActive: boolean;
    isError: boolean;
    listService: Service[];
    selectedService: Service;
};
const initialState: ServiceType = {
    isLoading: false,
    isLoadingAdd: false,
    isLoadingEdit: false,
    isLoadingDelete: false,
    isLoadingActive: false,
    isError: false,
    listService: [],
    selectedService: {
        id: '',
        serviceName: '',
        price: 0,
        description: '',
        isDelete: false,
    },
};

export const getAllService = createAsyncThunk('service/getAllService', async (_, { rejectWithValue }) => {
    try {
        const response = await myAxios.get(`/servicepackage?page=1&size=100`);
        return response.data.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        return rejectWithValue(errorMessage);
    }
});

export const addService = createAsyncThunk(
    'service/addService',
    async (formData: FormData, { dispatch, rejectWithValue }) => {
        try {
            const response = await myAxios.post(`/servicepackage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await dispatch(getAllService());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);
export const editService = createAsyncThunk(
    'service/editService',
    async ({ id, formData }: { id: string; formData: FormData }, { dispatch, rejectWithValue }) => {
        try {
            const response = await myAxios.put(`/servicepackage/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await dispatch(getAllService());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);
export const deleteService = createAsyncThunk(
    'service/deleteService',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await myAxios.delete(`/servicepackage/${id}`);
            await dispatch(getAllService());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);
export const activeService = createAsyncThunk(
    'service/activeService',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await myAxios.put(`/servicepackage/enable-servicepackage/${id}`);
            await dispatch(getAllService());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    },
);

const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        selectService: (state, action: PayloadAction<Service>) => {
            const service = action.payload;
            state.selectedService = service;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllService.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listService = action.payload;
            })
            .addCase(getAllService.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });

        builder
            .addCase(addService.pending, (state) => {
                state.isLoadingAdd = true;
                state.isError = false;
            })
            .addCase(addService.fulfilled, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = false;
            })
            .addCase(addService.rejected, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = true;
            });
        builder
            .addCase(editService.pending, (state) => {
                state.isLoadingEdit = true;
                state.isError = false;
            })
            .addCase(editService.fulfilled, (state, action) => {
                state.isLoadingEdit = false;
                state.isError = false;
            })
            .addCase(editService.rejected, (state, action) => {
                state.isLoadingEdit = false;
                state.isError = true;
            });
        builder
            .addCase(deleteService.pending, (state) => {
                state.isLoadingDelete = true;
                state.isError = false;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.isLoadingDelete = false;
                state.isError = false;
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isLoadingDelete = false;
                state.isError = true;
            });
        builder
            .addCase(activeService.pending, (state) => {
                state.isLoadingActive = true;
                state.isError = false;
            })
            .addCase(activeService.fulfilled, (state, action) => {
                state.isLoadingActive = false;
                state.isError = false;
            })
            .addCase(activeService.rejected, (state, action) => {
                state.isLoadingActive = false;
                state.isError = true;
            });
    },
});
export const { selectService } = serviceSlice.actions;
export default serviceSlice.reducer;
