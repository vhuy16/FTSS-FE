import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

export type UserProfile = {
    userId: string;
    username: string;
    fullName: string;
    address: string;
    email: string;
    phoneNumber: string;
    gender: string;
    role: string;
};

type ProfileType = {
    isLoading: boolean | null;
    user: UserProfile | null;
    isError: boolean | null;
};
const initialState: ProfileType = {
    isLoading: false,
    user: null,
    isError: false,
};

// Async thunk for fetching the user profile
export const getUserProfile = createAsyncThunk('profile/UserProfile', async () => {
    try {
        const response = await myAxios.get(`https://ftss.id.vn/api/v1/usertoken`);
        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
});

// Assuming UserProfile is defined appropriately somewhere

const userSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.user = null;
                state.isError = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload; // lam theo cai ta return
                state.isError = null;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isError = true;
            });
    },
});

export default userSlice.reducer;
