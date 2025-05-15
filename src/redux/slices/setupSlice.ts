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
  isDelete: boolean;
};
type SetupDatas = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  setupPackages: SetupPackage[];
};
type SetupState = {
  loading: boolean;
  isloadingGetAllPackageShop: boolean;
  isLoadingEnable: boolean;
  isLoadingEdit: boolean;
  setupPackages: SetupPackage[];
  setupPackagesShop: SetupDatas;
  selectedSetup: SetupPackage | null;
  error: string | null;
  response: any | null;
  setupData: SetupPackage | null; //detail
};

const initialState: SetupState = {
  setupPackages: [],
  setupPackagesShop: { pageNumber: 0, pageSize: 0, totalRecords: 0, setupPackages: [], totalPages: 0 },
  loading: false,
  isloadingGetAllPackageShop: false,
  isLoadingEnable: false,
  isLoadingEdit: false,
  selectedSetup: null,
  error: null,
  response: null,
  setupData: null,
};

export const getSetupPackages = createAsyncThunk("setup/getSetupPackages", async () => {
  try {
    const response = await myAxios.get(`/setuppackage?page=1&size=50`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching setup packages:", error);
    throw error;
  }
});

export const getSetupPackagesShop = createAsyncThunk(
  "setup/getSetupPackagesShop",
  async (
    { page, size, minPrice, maxPrice }: { page?: number; size?: number; minPrice?: number; maxPrice?: number },
    { rejectWithValue }
  ) => {
    try {
      const baseUrl = "/setuppackage/all-shop";
      let url = `${baseUrl}?page=${page}&size=${size}`;

      if ((minPrice as number) >= 0 && (maxPrice as number) >= 0) {
        url += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }

      const response = await myAxios.get(url);
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lấy sản phẩm thất bại");
    }
  }
);
export const getAllSetupPackagesSimilar = createAsyncThunk("setup/getAllSetupPackagesSimilar", async () => {
  try {
    const response = await myAxios.get(`/setuppackage/all-shop?page=1&size=4`);
    return response.data.data.setupPackages;
  } catch (error: any) {
    console.error("Error fetching setup packages:", error);
    throw error;
  }
});
export const createSetupPackage = createAsyncThunk(
  "setup/createSetupPackage",
  async (formData: FormData, { rejectWithValue, dispatch }) => {
    try {
      const response = await myAxios.post(`/setuppackage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const role = localStorage.getItem("role");
      if (role == "Customer") {
        await dispatch(getSetupPackages());
      } else {
        await dispatch(getSetupPackagesShop({ page: 1, size: 100 }));
      }

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
      const response = await myAxios.put(`/setuppackage/${setupPackageId}`, formData, {
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
  async (setupPackageId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await myAxios.delete(`/setuppackage/${setupPackageId}`);
      if (response.data?.status === "200") {
        const role = localStorage.getItem("role");
        if (role == "Customer") {
          await dispatch(getSetupPackages());
        } else {
          await dispatch(getSetupPackagesShop({ page: 1, size: 100 }));
        }
        return { setupPackageId, message: response.data.message };
      }
      return rejectWithValue(response.data?.message || "Xóa thất bại");
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa gói cài đặt");
    }
  }
);
export const activateSetup = createAsyncThunk(
  "setup/activateSetup",
  async (setupPackageId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await myAxios.put(`/setuppackage/enableSetupPackage/${setupPackageId}`);
      await dispatch(getSetupPackagesShop({ page: 1, size: 100 }));
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lỗi khi Kích hoạt gói cài đặt");
    }
  }
);
export const addSetUpToBuild = createAsyncThunk(
  "setup/addSetUpToBuild",
  async (setupPackageId: string, { rejectWithValue }) => {
    try {
      const response = await myAxios.post(`/setuppackagecopySetupPackage/${setupPackageId}`);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lỗi khi thêm gói cài đặt");
    }
  }
);
export const editSetup = createAsyncThunk(
  "setup/editSetup",
  async ({ formData, id }: { formData: FormData; id: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await myAxios.put(`setuppackage/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await dispatch(getSetupPackagesShop({ page: 1, size: 100 }));
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lỗi khi cập nhật gói cài đặt");
    }
  }
);
const setupSlice = createSlice({
  name: "setup",
  initialState,
  reducers: {
    selectSetup: (state, action: PayloadAction<SetupPackage>) => {
      const setup = action.payload;
      state.selectedSetup = setup;
    },
  },
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
        state.isloadingGetAllPackageShop = true;
        state.error = null;
      })
      .addCase(getSetupPackagesShop.fulfilled, (state, action) => {
        state.isloadingGetAllPackageShop = false;
        state.setupPackagesShop = action.payload;
      })
      .addCase(getSetupPackagesShop.rejected, (state, action) => {
        state.isloadingGetAllPackageShop = false;
        state.error = action.payload as string;
      })
      .addCase(getAllSetupPackagesSimilar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSetupPackagesSimilar.fulfilled, (state, action: PayloadAction<SetupPackage[]>) => {
        state.loading = false;
        state.setupPackages = action.payload;
      })
      .addCase(getAllSetupPackagesSimilar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSetupPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSetupPackage.fulfilled, (state, action: PayloadAction<SetupPackage>) => {
        state.loading = false;
        state.error = null;
        // state.setupPackages.push(action.payload);
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
        // state.setupPackages = state.setupPackages.filter(
        //     (setup) => setup.setupPackageId !== action.payload.setupPackageId,
        // );
      })
      .addCase(deleteSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(activateSetup.pending, (state) => {
        state.isLoadingEnable = true;
        state.error = null;
      })
      .addCase(activateSetup.fulfilled, (state, action) => {
        state.isLoadingEnable = false;
        state.error = null;
      })
      .addCase(activateSetup.rejected, (state, action) => {
        state.isLoadingEnable = false;
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
      })
      .addCase(addSetUpToBuild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSetUpToBuild.fulfilled, (state, action: PayloadAction<SetupPackage>) => {
        state.loading = false;
        state.error = null;
        state.setupPackages.push(action.payload);
      })
      .addCase(addSetUpToBuild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editSetup.pending, (state) => {
        state.isLoadingEdit = true;
        state.error = null;
      })
      .addCase(editSetup.fulfilled, (state) => {
        state.isLoadingEdit = false;
        state.error = null;
      })
      .addCase(editSetup.rejected, (state, action) => {
        state.isLoadingEdit = false;
        state.error = action.payload as string;
      });
  },
});
export const { selectSetup } = setupSlice.actions;
export default setupSlice.reducer;
