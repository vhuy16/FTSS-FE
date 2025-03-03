import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";

export type Product = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  status: string;
  isDelete: boolean;
  categoryName: string;
  images: string;
};

export type SetupPackage = {
  setupPackageId: string;
  setupName: string;
  description: string;
  totalPrice: number;
  createDate: string;
  modifyDate: string;
  size: string | null;
  images?: string;
  products: Product[];
};

type SetupState = {
  loading: boolean;
  setupPackages: SetupPackage[];
  error: string | null;
  response: any | null;
  setupData: SetupPackage | null;
};

const initialState: SetupState = {
  setupPackages: [],
  loading: false,
  error: null,
  response: null,
  setupData: null,
};

export const getSetupPackages = createAsyncThunk("setup/getSetupPackages", async () => {
  try {
    const response = await myAxios.get(`https://ftss.id.vn/api/v1/setuppackage?page=1&size=10`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching setup packages:", error);
    throw error;
  }
});
export const getSetupPackagesShop = createAsyncThunk("setup/getSetupPackagesShop", async () => {
  try {
    const response = await myAxios.get(`https://ftss.id.vn/api/v1/setuppackage/all-shop?page=1&size=10`);
    return response.data.data.setupPackages;
  } catch (error: any) {
    console.error("Error fetching setup packages:", error);
    throw error;
  }
});
export const createSetupPackage = createAsyncThunk(
  "setup/createSetupPackage",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await myAxios.post(`https://ftss.id.vn/api/v1/setuppackage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error creating setup package:", error);
      return rejectWithValue(error.response?.data?.message || "Error creating setup package");
    }
  }
);
export const updateSetupPackage = createAsyncThunk(
  "setup/updateSetupPackage",
  async ({ setupPackageId, formData }: { setupPackageId: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await myAxios.put(`https://ftss.id.vn/api/v1/setuppackage/${setupPackageId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating setup package:", error);
      return rejectWithValue(error.response?.data?.message || "Error updating setup package");
    }
  }
);

export const deleteSetup = createAsyncThunk(
  "setup/deleteSetup",
  async (setupPackageId: string, { rejectWithValue }) => {
    try {
      const response = await myAxios.delete(`/setuppackage/${setupPackageId}`);
      if (response.data?.status === "200") {
        return { setupPackageId, message: response.data.message };
      }
      return rejectWithValue(response.data?.message || "Xóa thất bại");
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa gói cài đặt");
    }
  }
);
const setupSlice = createSlice({
  name: "setup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSetupPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSetupPackages.fulfilled, (state, action: PayloadAction<SetupPackage[]>) => {
        state.loading = false;
        state.setupPackages = action.payload;
      })
      .addCase(getSetupPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getSetupPackagesShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSetupPackagesShop.fulfilled, (state, action: PayloadAction<SetupPackage[]>) => {
        state.loading = false;
        state.setupPackages = action.payload;
      })
      .addCase(getSetupPackagesShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSetupPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSetupPackage.fulfilled, (state, action: PayloadAction<SetupPackage>) => {
        state.loading = false;
        state.setupPackages.push(action.payload);
      })
      .addCase(createSetupPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSetup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.response = action.payload;

        // Cập nhật danh sách setupPackages sau khi xóa thành công
        state.setupPackages = state.setupPackages.filter(
          (setup) => setup.setupPackageId !== action.payload.setupPackageId
        );
      })
      .addCase(deleteSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSetupPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSetupPackage.fulfilled, (state, action: PayloadAction<SetupPackage>) => {
        state.loading = false;
        state.setupPackages = state.setupPackages.map((setup) =>
          setup.setupPackageId === action.payload.setupPackageId ? action.payload : setup
        );

        // Nếu setupData hiện tại là cái vừa được cập nhật, thì cập nhật nó luôn
        if (state.setupData && state.setupData.setupPackageId === action.payload.setupPackageId) {
          state.setupData = action.payload;
        }
      })

      .addCase(updateSetupPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default setupSlice.reducer;
