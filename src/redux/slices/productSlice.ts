import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

export type Product = {
    id: string;
    productName: string;
    description: string;
    quantity: number;
    subCategoryName: string;
    categoryName: string;
    price: number;
    status: string;
    images: string[] | string;
};

type ProductData = {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: Product[];
};
type ListCateAndProduct = {
    categoryName: string;
    products: Product[];
};
type initialStateProduct = {
    data: ProductData | null;
    listProductForAdmin: Product[];
    selectedProduct: Product;
    listCateAndProduct: ListCateAndProduct[];
    isLoading: boolean;
    isLoadingGetCateWithProduct: boolean;
    isLoadingAdd: boolean;
    isLoadingEdit: boolean;
    isLoadingDelete: boolean;
    isLoadingEnable: boolean;
    isError: boolean;
};

export const getAllProduct = createAsyncThunk(
    'product/getAll',
    async (
        {
            page,
            size,
            minPrice,
            maxPrice,
            subcategoryName,
        }: { page?: number; size?: number; minPrice?: number; maxPrice?: number; subcategoryName?: string },
        { rejectWithValue },
    ) => {
        try {
            const baseUrl = '/product/get-all-product';
            let url = baseUrl;
            if (page && size) {
                url = `${baseUrl}?page=${page}&size=${size}`;
                if ((minPrice as number) >= 0 && (maxPrice as number) >= 0) {
                    url = `${baseUrl}?page=${page}&size=${size}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
                    if (subcategoryName) {
                        url = `${baseUrl}?page=${page}&size=${size}&subcategoryName=${subcategoryName}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
                    }
                } else {
                    if (subcategoryName) {
                        url = `${baseUrl}?page=${page}&size=${size}&subcategoryName=${subcategoryName}`;
                    }
                }
            }

            const response = await myAxios.get(url);
            return response.data.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Lấy sản phẩm thất bại');
        }
    },
);
export const getAllProductSimilar = createAsyncThunk(
    'product/getAllProductSimilar',
    async (cateName: string, { rejectWithValue }) => {
        try {
            const response = await myAxios.get(`/product/get-all-product?page=1&size=4&cateName=${cateName}`);
            return response.data.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Lấy sản phẩm thất bại');
        }
    },
);
export const getAllProductForAdmin = createAsyncThunk(
    'product/getAllProductForAdmin',
    async (_, { rejectWithValue }) => {
        try {
            const response = await myAxios.get(`/product?page=1&size=100`);
            return response.data.data.items;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Lấy sản phẩm thất bại');
        }
    },
);
export const getProductByNameForAdmin = createAsyncThunk(
    'product/getProductByNameForAdmin',
    async (productName: string, { rejectWithValue }) => {
        try {
            const response = await myAxios.get(`/product?page=1&size=100&productName=${productName}`);
            return response.data.data.items;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Lấy sản phẩm thất bại');
        }
    },
);
export const getAllCategoryWithProduct = createAsyncThunk(
    'product/getAllCategoryWithProduct',
    async (_, { rejectWithValue }) => {
        try {
            const response = await myAxios.get(`/product/subcategory?page=1&size=100`);
            return response.data.data.categories;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Lấy sản phẩm thất bại');
        }
    },
);
export const addProducts = createAsyncThunk('product/addProducts', async (formData: FormData, { dispatch }) => {
    try {
        const response = await myAxios.post(`/product`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        await dispatch(getAllProductForAdmin());
        return response.data;
    } catch (error: any) {
        console.log(error);
    }
});
export const editProducts = createAsyncThunk(
    'product/editProducts',
    async ({ formData, id }: { formData: FormData; id: string }, { dispatch }) => {
        try {
            const response = await myAxios.put(`product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await dispatch(getAllProductForAdmin());
            return response.data;
        } catch (error: any) {
            console.log(error);
        }
    },
);
export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await myAxios.delete(`/product/${id}`);
            await dispatch(getAllProductForAdmin());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Xóa phẩm thất bại');
        }
    },
);
export const enableProduct = createAsyncThunk(
    'product/enableProduct',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await myAxios.put(`/product/enable-product/${id}`);
            await dispatch(getAllProductForAdmin());
            return response.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Kích hoạt thất bại');
        }
    },
);

const initialState: initialStateProduct = {
    data: null,
    listProductForAdmin: [],
    selectedProduct: {
        id: '',
        productName: '',
        description: '',
        quantity: 0,
        subCategoryName: '',
        categoryName: '',
        price: 0,
        status: '',
        images: '',
    },
    listCateAndProduct: [],
    isLoading: false,
    isLoadingGetCateWithProduct: false,
    isLoadingAdd: false,
    isLoadingEdit: false,
    isLoadingDelete: false,
    isLoadingEnable: false,
    isError: false,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        selectProduct: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            state.selectedProduct = product;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProduct.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.data = action.payload;
            })
            .addCase(getAllProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getAllProductSimilar.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllProductSimilar.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.data = action.payload;
            })
            .addCase(getAllProductSimilar.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getAllProductForAdmin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllProductForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listProductForAdmin = action.payload;
            })
            .addCase(getAllProductForAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getProductByNameForAdmin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getProductByNameForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.listProductForAdmin = action.payload;
            })
            .addCase(getProductByNameForAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(addProducts.pending, (state) => {
                state.isLoadingAdd = true;
                state.isError = false;
            })
            .addCase(addProducts.fulfilled, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = false;
            })
            .addCase(addProducts.rejected, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = true;
            });
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.isLoadingDelete = true;
                state.isError = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoadingDelete = false;
                state.isError = false;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoadingDelete = false;
                state.isError = true;
            });
        builder
            .addCase(enableProduct.pending, (state) => {
                state.isLoadingEnable = true;
                state.isError = false;
            })
            .addCase(enableProduct.fulfilled, (state, action) => {
                state.isLoadingEnable = false;
                state.isError = false;
            })
            .addCase(enableProduct.rejected, (state, action) => {
                state.isLoadingEnable = false;
                state.isError = true;
            });
        builder
            .addCase(getAllCategoryWithProduct.pending, (state) => {
                state.isLoadingGetCateWithProduct = true;
                state.isError = false;
            })
            .addCase(getAllCategoryWithProduct.fulfilled, (state, action) => {
                state.isLoadingGetCateWithProduct = false;
                state.isError = false;
                state.listCateAndProduct = action.payload;
            })
            .addCase(getAllCategoryWithProduct.rejected, (state, action) => {
                state.isLoadingGetCateWithProduct = false;
                state.isError = true;
            });
        builder
            .addCase(editProducts.pending, (state) => {
                state.isLoadingEdit = true;
                state.isError = false;
            })
            .addCase(editProducts.fulfilled, (state, action) => {
                state.isLoadingEdit = false;
                state.isError = false;
            })
            .addCase(editProducts.rejected, (state, action) => {
                state.isLoadingEdit = false;
                state.isError = true;
            });
    },
});
export const { selectProduct } = productSlice.actions;
export default productSlice.reducer;
