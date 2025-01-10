// src/store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./productSlice";

export type CartItem = {
  item: Product;
  quantity: number;
};

interface CartState {
  items: CartItem[];
}

const storedCartItems: CartItem[] = JSON.parse(localStorage.getItem("cartItems") || "[]");

const initialState: CartState = {
  items: storedCartItems,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const newItem = action.payload;

      // Tìm xem item với id này đã tồn tại trong giỏ hàng chưa
      const existingItem = state.items.find((item) => item.item.id === newItem.id);

      if (existingItem) {
        // Nếu đã tồn tại, cộng số lượng thêm
        existingItem.quantity += 1;
      } else {
        // Nếu chưa tồn tại, thêm item mới vào giỏ hàng
        state.items.push({ item: newItem, quantity: 1 });
      }

      // Lưu lại vào localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<Product>) => {
      const deleteItem = action.payload;
      const existingItem = state.items.find((item) => item.item.id === deleteItem.id);
      if (existingItem) {
        // Nếu đã tồn tại, cộng số lượng thêm
        existingItem.quantity -= 1;
        if (existingItem.quantity <= 0) {
          state.items = state.items.filter((item) => item.item.id !== existingItem.item.id);
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items)); // Cập nhật lại localStorage
    },
    deleteItem: (state, action: PayloadAction<Product>) => {
      const deleteItem = action.payload;
      const existingItem = state.items.find((item) => item.item.id === deleteItem.id);
      if (existingItem) {
        state.items = state.items.filter((item) => item.item.id !== existingItem.item.id);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items)); // Cập nhật lại localStorage
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems"); // Xóa dữ liệu trong localStorage
    },
  },
});

export const { addItem, removeItem, clearCart, deleteItem } = cartSlice.actions;
export default cartSlice.reducer;
