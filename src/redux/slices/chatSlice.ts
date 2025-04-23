import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';
type Room = {
    id: string;
    customerId: string;
    managerId: string;
    managerName: string;
    createdAt: string;
    customerName: string;
    latestMessageTime: string;
};
type Media = {
    url: string;
    type: string;
};
type Chat = {
    id: number;
    userId: string;
    roomId: string;
    username: string;
    role: string;
    text: string;
    media: Media[];
    timestamp: string;
};
type initialStateIssue = {
    isLoading: boolean;
    isLoadingRooms: boolean;
    isError: boolean;
    isLoadingAdd: boolean;
    rooms: Room[];
    selectedRoom: Room;
    chat: Chat[];
};
const initialState: initialStateIssue = {
    isLoading: false,
    isLoadingRooms: false,
    isError: false,
    isLoadingAdd: false,
    rooms: [],
    selectedRoom: {
        id: '',
        customerId: '',
        managerId: '',
        managerName: '',
        createdAt: '',
        customerName: '',
        latestMessageTime: '',
    },
    chat: [],
};
export const getAllRoom = createAsyncThunk('chat/getAllRoom', async (__dirname, { rejectWithValue }) => {
    try {
        const response = await myAxios.get('/Chat/rooms');
        return response.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy phòng thất bại');
    }
});
export const getAllRooms = createAsyncThunk('chat/getAllRooms', async (__dirname, { rejectWithValue }) => {
    try {
        const response = await myAxios.get('/Chat/rooms');
        return response.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy phòng thất bại');
    }
});
export const getRoomDetail = createAsyncThunk('chat/getRoomDetail', async (id: string, { rejectWithValue }) => {
    try {
        const response = await myAxios.get(`/Chat/messages?roomId=${id}&page=1&size=1000`);
        return response.data.messages;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Lấy tin nhắn thất bại');
    }
});
export const createChat = createAsyncThunk('chat/createChat', async (formData: FormData, { dispatch }) => {
    try {
        const response = await myAxios.post(`/Chat/messages`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        console.log(error);
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
                state.isLoadingRooms = true;
                state.isError = false;
            })
            .addCase(getAllRoom.fulfilled, (state, action) => {
                state.isLoadingRooms = false;
                state.isError = false;
                state.rooms = action.payload;
            })
            .addCase(getAllRoom.rejected, (state, action) => {
                state.isLoadingRooms = false;
                state.isError = true;
            });
        builder
            .addCase(getAllRooms.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllRooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.rooms = action.payload;
            })
            .addCase(getAllRooms.rejected, (state, action) => {
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
        builder
            .addCase(createChat.pending, (state) => {
                state.isLoadingAdd = true;
                state.isError = false;
            })
            .addCase(createChat.fulfilled, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = false;
            })
            .addCase(createChat.rejected, (state, action) => {
                state.isLoadingAdd = false;
                state.isError = true;
            });
    },
});
export const { selectRoom } = ChatSlice.actions;
export default ChatSlice.reducer;
