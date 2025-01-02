import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Đường dẫn này tùy thuộc vào cấu trúc dự án của bạn

// Định nghĩa kiểu dữ liệu cho state
interface SidebarState {
    isSidebarOpen: boolean;
}

// Khởi tạo state ban đầu với kiểu dữ liệu đã định nghĩa
const initialState: SidebarState = {
    isSidebarOpen: false,
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
    },
});

// Selector với kiểu dữ liệu của RootState
export const selectIsSidebarOpen = (state: RootState): boolean => state.sidebar.isSidebarOpen;
export const { toggleSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
