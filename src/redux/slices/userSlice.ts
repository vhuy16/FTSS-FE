import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

export type UserProfile = {
  userId: string;
  username: string;
  fullName: string;
  address: string;
  email: string;
  phoneNumber: string;
  gender: string;
  role: string;
  isDeleted: boolean;
  cityId: string | null;
  districtId: string | null;
  bankName: string;
  bankNumber: string;
  bankHolder: string;
};

type ProfileType = {
  isLoading: boolean | null;
  isLoadingEdit: boolean | null;
  isLoadingUpdate: boolean | null;
  isLoadingGetAllUser: boolean | null;
  user: UserProfile | null;
  listUser: UserProfile[];
  isError: boolean | null;
  error: string | null;
};
const initialState: ProfileType = {
  isLoading: false,
  isLoadingEdit: false,
  isLoadingGetAllUser: false,
  isLoadingUpdate: false,
  user: null,
  listUser: [],
  isError: false,
  error: null,
};

// Async thunk for fetching the user profile
export const getUserProfile = createAsyncThunk("profile/UserProfile", async () => {
  try {
    const response = await myAxios.get(`/usertoken`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
});
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ userId, updatedData }: { userId: string; updatedData: any }, { dispatch, rejectWithValue }) => {
    try {
      const response = await myAxios.put(`/user/${userId}`, updatedData);
      await dispatch(getUserProfile());
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Cập nhật thông tin thất bại !!");
    }
  }
);
export const getAllUser = createAsyncThunk("user/getAllUser", async () => {
  try {
    const response = await myAxios.get(`/user?page=1&size=100`);
    return response.data.data.items;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
});
export const updateRoleUser = createAsyncThunk(
  "user/updateRoleUser",
  async (
    {
      userId,
      userInfo,
    }: {
      userId: string;
      userInfo: { gender: number; fullName: string; phoneNumber: string; address: string; role: string };
    },
    { dispatch }
  ) => {
    try {
      const response = await myAxios.put(`/user/${userId}`, userInfo);
      await dispatch(getAllUser());
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
);

// Assuming UserProfile is defined appropriately somewhere

const userSlice = createSlice({
  name: "profile",
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
    builder
      .addCase(getAllUser.pending, (state) => {
        state.isLoadingGetAllUser = true;
        state.isError = null;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.isLoadingGetAllUser = false;
        state.listUser = action.payload; // lam theo cai ta return
        state.isError = null;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.isLoadingGetAllUser = false;
        state.isError = true;
      });
    builder
      .addCase(updateRoleUser.pending, (state) => {
        state.isLoadingEdit = true;
        state.isError = null;
      })
      .addCase(updateRoleUser.fulfilled, (state, action) => {
        state.isLoadingEdit = false;
        state.isError = null;
      })
      .addCase(updateRoleUser.rejected, (state, action) => {
        state.isLoadingEdit = false;
        state.isError = true;
      });
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoadingUpdate = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoadingUpdate = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoadingUpdate = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
