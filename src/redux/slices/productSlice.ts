import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
type initialStateProduct = {
    data: ProductData | null;
    listProductForAdmin: Product[];
    isLoading: boolean;
    isLoadingAdd: boolean;
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
            const response = await myAxios.get(
                `https://ftss.id.vn/api/v1/product/get-all-product?page=1&size=4&cateName=${cateName}`,
            );
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

const initialState: initialStateProduct = {
    data: null,
    listProductForAdmin: [],
    isLoading: false,
    isLoadingAdd: false,
    isError: false,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
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
    },
});
export default productSlice.reducer;
