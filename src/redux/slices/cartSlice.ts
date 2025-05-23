// src/store/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';

// Cấu trúc của một item trong giỏ hàng
export type CartItem = {
    cartItemId: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    linkImage: string;
    unitPrice: number;
    status: string;
};

interface CartState {
    items: CartItem[];
    cartselected: CartItem[];
    loading: boolean;
    error: string | null;
    message: string | null;
    setupId: string;
}

const initialState: CartState = {
    items: [],
    cartselected: [],
    loading: false,
    error: null,
    message: null,
    setupId: '',
};

// Async thunk để thêm sản phẩm vào giỏ hàng
export const addItem = createAsyncThunk(
    'cart/addItemToCart',
    async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
        try {
            const response = await myAxios.post(`/cart/item`, [{ productId, quantity, status: 'Odd' }]);
            return response.data.data; // Trả về dữ liệu sản phẩm vừa thêm
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
        }
    },
);

export const addSetup = createAsyncThunk(
    'cart/cart/addSetUpToCart',
    async (setupPackageId: string | undefined, { rejectWithValue }) => {
        try {
            const response = await myAxios.post('/cart/setup-package', JSON.stringify(setupPackageId), {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update item quantity');
        }
    },
);
export const updateItemQuantity = createAsyncThunk(
    'cart/updateItemQuantity',
    async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }, { rejectWithValue }) => {
        try {
            const response = await myAxios.put(`/cartitem/${cartItemId}`, { quantity });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update item quantity');
        }
    },
);
export const removeItem = createAsyncThunk(
    'cart/removeItem',
    async ({ cartItemId }: { cartItemId: string }, { rejectWithValue }) => {
        try {
            const response = await myAxios.delete(`/cartitem/${cartItemId}`);
            return response.data.message;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update item quantity');
        }
    },
);

// Async thunk để lấy danh sách sản phẩm trong giỏ hàng
export const getAllCart = createAsyncThunk('cart/getAllCart', async () => {
    const response = await myAxios.get('/cart');
    return response.data.data;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.error = null;
        },
        selectCart: (state, action: PayloadAction<CartItem>) => {
            const cartItem = action.payload;
            const isSelected = state.cartselected.some((p) => p.cartItemId === cartItem.cartItemId);

            if (isSelected) {
                state.cartselected = state.cartselected.filter((p) => p.cartItemId !== cartItem.cartItemId);
            } else {
                state.cartselected = [...state.cartselected, cartItem];
            }
        },
        updateSelectedCart: (state, action: PayloadAction<CartItem>) => {
            const cartItem = action.payload;
            const isSelected = state.cartselected.find((p) => p.cartItemId === cartItem.cartItemId);

            if (isSelected && isSelected.cartItemId) {
                if (isSelected.quantity !== cartItem.quantity) {
                    state.cartselected = state.cartselected.filter((p) => p.cartItemId !== cartItem.cartItemId);
                    state.cartselected = [...state.cartselected, cartItem];
                } else {
                    state.cartselected = state.cartselected.filter((p) => p.cartItemId !== cartItem.cartItemId);
                }
            }
        },
        selectSetup: (state, action: PayloadAction<CartItem[]>) => {
            const cartItem = action.payload;
            state.cartselected = cartItem;
        },
        selectSetupId: (state, action: PayloadAction<string>) => {
            state.setupId = action.payload;
        },
        deleteSelectSetupId: (state) => {
            state.setupId = '';
        },
        removeCart: (state) => {
            state.cartselected = [];
        },
        deleteSelectedCart: (state, action: PayloadAction<CartItem>) => {
            const cartItem = action.payload;
            const isSelected = state.cartselected.some((p) => p.cartItemId === cartItem.cartItemId);

            if (isSelected) {
                state.cartselected = state.cartselected.filter((p) => p.cartItemId !== cartItem.cartItemId);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Xử lý thêm sản phẩm vào giỏ hàng
            .addCase(addItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItem.fulfilled, (state, action) => {
                const newItem = action.payload; // Sản phẩm vừa thêm
                if (newItem) {
                    // Kiểm tra xem sản phẩm đã tồn tại chưa, nếu có thì cập nhật số lượng
                    const existingItem = state.items.find((item) => item.productId === newItem.productId);
                    if (existingItem) {
                        existingItem.quantity += newItem.quantity || 1;
                    } else {
                        state.items.push({
                            ...newItem,
                            quantity: newItem.quantity || 1,
                        });
                    }
                }
                state.loading = false;
            })
            .addCase(addItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // add setup
            .addCase(addSetup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSetup.fulfilled, (state, action) => {
                state.items = action.payload; // Cập nhật danh sách sản phẩm
                state.loading = false;
            })
            .addCase(addSetup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // lấy danh sách giỏ hàng
            .addCase(getAllCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCart.fulfilled, (state, action) => {
                state.items = action.payload; // Cập nhật danh sách sản phẩm
                state.loading = false;
            })
            .addCase(getAllCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // cap nhat so luong trong cart
            .addCase(updateItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateItemQuantity.fulfilled, (state, action) => {
                const updatedItem = action.payload; // Sản phẩm được cập nhật (dữ liệu từ API)
                const index = state.items.findIndex((item) => item.cartItemId === updatedItem.cartItemId);

                if (index !== -1) {
                    // Chỉ cập nhật những trường cần thiết
                    state.items[index] = {
                        ...state.items[index], // Giữ nguyên các trường cũ
                        ...updatedItem, // Ghi đè các trường mới (nếu có)
                    };
                }
                state.loading = false;
            })
            .addCase(updateItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // xoa san pham ra khoi cart
            .addCase(removeItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeItem.fulfilled, (state, action) => {
                state.message = action.payload as string;
                // Xóa sản phẩm khỏi giỏ hàng
                state.items = state.items.filter((item) => item.cartItemId !== action.meta.arg.cartItemId);
                state.loading = false;
            })
            .addCase(removeItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearCart,
    selectCart,
    updateSelectedCart,
    deleteSelectedCart,
    selectSetup,
    removeCart,
    selectSetupId,
    deleteSelectSetupId,
} = cartSlice.actions;
export default cartSlice.reducer;
