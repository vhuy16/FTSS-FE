import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
export type SubCategory = {
  id: string;
  subCategoryName: string;
  categoryId: string;
  description: string;
  createDate: string;
  modifyDate: string;
  categoryName: string;
};
type categoryType = {
  categoryName: string;
  id: string;
  description: string;
  image: string;
  createDate: string;
  modifyDate: string;
  subCategories: SubCategory[] | null;
  isFishTank: boolean;
  isObligatory: boolean;
};

export const getAllCategory = createAsyncThunk("category/getAllCategory", async () => {
  const response = await myAxios.get("/category?page=1&size=100");
  return response.data.data.items;
});
export const getAllSubCategory = createAsyncThunk("category/getAllSubCategory", async (_, { rejectWithValue }) => {
  try {
    const response = await myAxios.get("/subcategory?page=1&size=100");
    return response.data.data.items;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Lấy danh mục phụ thất bại");
  }
});
export const getAllSubCategoryByCateName = createAsyncThunk(
  "category/getAllSubCategoryByCateName",
  async (cateName: string) => {
    try {
      const response = await myAxios.get(`/category?page=1&size=100&searchName=${cateName}`);
      return response.data.data.items[0].subCategories;
    } catch (error: any) {
      console.log(error);
    }
  }
);
export const addCategory = createAsyncThunk("category/addCategory", async (formData: FormData, { dispatch }) => {
  try {
    const response = await myAxios.post(`/category`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await dispatch(getAllCategory());
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
});
export const addSubCategory = createAsyncThunk(
  "category/addSubCategory",
  async (data: { subCategoryName: string; categoryId: string; description: string }, { dispatch }) => {
    try {
      const response = await myAxios.post(`/subcategory`, data);
      await dispatch(getAllSubCategory());
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  }
);

type CategoryState = {
  isLoading: boolean;
  isLoadingAdd: boolean;
  isLoadingAddSubCate: boolean;
  isLoadingGetAllCategory: boolean;
  isLoadingGetAllSubCategory: boolean;
  categories: categoryType[];
  subCates: SubCategory[];
  subCategory: SubCategory[];
  isError: boolean;
};

const initialState: CategoryState = {
  isLoading: false,
  isLoadingAdd: false,
  isLoadingAddSubCate: false,
  isLoadingGetAllCategory: false,
  isLoadingGetAllSubCategory: false,
  categories: [],
  subCates: [],
  subCategory: [],
  isError: false,
};

const ListCategorySlice = createSlice({
  name: "listCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.isLoadingGetAllCategory = true;
        state.isError = false;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.isLoadingGetAllCategory = false;
        state.categories = action.payload;
        state.isError = false;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.isLoadingGetAllCategory = false;
        state.isError = true;
      });
    builder
      .addCase(getAllSubCategoryByCateName.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllSubCategoryByCateName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subCates = action.payload;
        state.isError = false;
      })
      .addCase(getAllSubCategoryByCateName.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(getAllSubCategory.pending, (state) => {
        state.isLoadingGetAllSubCategory = true;
        state.isError = false;
      })
      .addCase(getAllSubCategory.fulfilled, (state, action) => {
        state.isLoadingGetAllSubCategory = false;
        state.subCategory = action.payload;
        state.isError = false;
      })
      .addCase(getAllSubCategory.rejected, (state, action) => {
        state.isLoadingGetAllSubCategory = false;
        state.isError = true;
      });
    builder
      .addCase(addCategory.pending, (state) => {
        state.isLoadingAdd = true;
        state.isError = false;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isLoadingAdd = false;
        state.isError = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isLoadingAdd = false;
        state.isError = true;
      });
    builder
      .addCase(addSubCategory.pending, (state) => {
        state.isLoadingAddSubCate = true;
        state.isError = false;
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.isLoadingAddSubCate = false;
        state.isError = false;
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.isLoadingAddSubCate = false;
        state.isError = true;
      });
  },
});

export default ListCategorySlice.reducer;
