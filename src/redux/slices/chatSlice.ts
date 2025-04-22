import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';
type Room = {
    id: string;
    customerId: string;
    managerId: string;
    managerName: string;
    createdAt: string;
};
type Chat = {
    id: number;
    userId: string;
    roomId: string;
    username: string;
    role: string;
    text: string;
    timestamp: string;
};
type initialStateIssue = {
    isLoading: boolean;
    isError: boolean;
    rooms: Room[];
    selectedRoom: Room;
    chat: Chat[];
};
const initialState: initialStateIssue = {
    isLoading: false,
    isError: false,
    rooms: [],
    selectedRoom: {
        id: '',
        customerId: '',
        managerId: '',
        managerName: '',
        createdAt: '',
    },
    chat: [],
};
export const getAllRoom = createAsyncThunk('chat/getAllRoom', async (__dirname, { rejectWithValue }) => {
    try {
        const response = await myAxios.get('https://ftss.id.vn/api/Chat/rooms');
        return response.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy phòng thất bại');
    }
});
export const getRoomDetail = createAsyncThunk('chat/getRoomDetail', async (id: string, { rejectWithValue }) => {
    try {
        const response = await myAxios.get(`https://ftss.id.vn/api/Chat/messages?roomId=${id}&page=1&size=1000`);
        return response.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy tin nhắn thất bại');
    }
});

const ChatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        selectRoom: (state, action: PayloadAction<Room>) => {
            const room = action.payload;
            state.selectedRoom = room;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllRoom.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllRoom.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.rooms = action.payload;
            })
            .addCase(getAllRoom.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
        builder
            .addCase(getRoomDetail.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getRoomDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.chat = action.payload;
            })
            .addCase(getRoomDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});
export const { selectRoom } = ChatSlice.actions;
export default ChatSlice.reducer;
