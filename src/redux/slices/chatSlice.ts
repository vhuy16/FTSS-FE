import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import myAxios from '@setup/axiosConfig';
export type Room = {
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
    isLoadingsendMessages: boolean;
    isLoadingCreateRoom: boolean;
};
const initialState: initialStateIssue = {
    isLoading: false,
    isLoadingRooms: false,
    isError: false,
    isLoadingAdd: false,
    isLoadingsendMessages: false,
    isLoadingCreateRoom: false,
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
export const CreateChatRoom = createAsyncThunk(
    'chat/CreateChatRoom',
    async ({ managerId }: { managerId: string }, { rejectWithValue }) => {
        try {
            const response = await myAxios.post(`/Chat/rooms`, { managerId });
            return response.data;
        } catch (error: any) {
            console.error('Error creating setup package:', error);
            return rejectWithValue(error.response?.data?.message || 'Hủy dịch vụ thất bại');
        }
    },
);
export const CreateChatofUser = createAsyncThunk(
    'chat/CreateChatofUser',
    async (
        { text, roomId, files }: { text?: string; roomId: string; files?: File[] },
        { dispatch, rejectWithValue },
    ) => {
        try {
            const formData = new FormData();
            formData.append('roomId', roomId);

            // Chỉ thêm text nếu tồn tại và không phải chuỗi rỗng
            if (text && text.trim() !== '') {
                formData.append('text', text);
            }

            // Chỉ thêm files nếu tồn tại và có ít nhất một file
            if (files && files.length > 0) {
                files.forEach((file) => {
                    formData.append('files', file);
                });
            }

            const response = await myAxios.post(`/Chat/messages`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error: any) {
            console.error(error);
            return rejectWithValue(error.response?.data?.message || 'Tạo tin nhắn thất bại');
        }
    },
);

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
        builder
            .addCase(CreateChatofUser.pending, (state) => {
                state.isLoadingsendMessages = true;
                state.isError = false;
            })
            .addCase(CreateChatofUser.fulfilled, (state, action) => {
                state.isLoadingsendMessages = false;
                state.isError = false;
            })
            .addCase(CreateChatofUser.rejected, (state, action) => {
                state.isLoadingsendMessages = false;
                state.isError = true;
            });
        builder
            .addCase(CreateChatRoom.pending, (state) => {
                state.isLoadingCreateRoom = true;
                state.isError = false;
            })
            .addCase(CreateChatRoom.fulfilled, (state, action) => {
                state.isLoadingCreateRoom = false;
                state.isError = false;
            })
            .addCase(CreateChatRoom.rejected, (state, action) => {
                state.isLoadingCreateRoom = false;
                state.isError = true;
            });
    },
});
export const { selectRoom } = ChatSlice.actions;
export default ChatSlice.reducer;
