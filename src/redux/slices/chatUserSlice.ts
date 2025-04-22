import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
export type ChatUserState = {
  id: number;
  userId: string;
  roomId: string;
  username: string;
  role: string;
  text: string;
  timestamp: string;
};
export const CreateChatRoom = createAsyncThunk(
  "chatUser/CreateChatRoom",
  async ({ managerId }: { managerId: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await myAxios.post(`https://ftss.id.vn/api/Chat/rooms`, { managerId });
      return response.data;
    } catch (error: any) {
      console.error("Error creating setup package:", error);
      return rejectWithValue(error.response?.data?.message || "Hủy dịch vụ thất bại");
    }
  }
);
export const CreateChat = createAsyncThunk(
  "chatUser/CreateChat",
  async ({ text, roomId }: { roomId: string; text: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await myAxios.post(`https://ftss.id.vn/api/Chat/messages`, { text, roomId });
      return response.data;
    } catch (error: any) {
      console.error("Error creating setup package:", error);
      return rejectWithValue(error.response?.data?.message || "Hủy dịch vụ thất bại");
    }
  }
);
export const getAllChatofUser = createAsyncThunk(
  "chatUser/getAllChatofUser",
  async ({ roomId }: { roomId: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await myAxios.get(`https://ftss.id.vn/api/Chat/messages?roomId=${roomId}&page=1&size=100`);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Lấy danh mục phụ thất bại");
    }
  }
);

type ChatState = {
  isLoading: boolean;
  isLoadingGetAllChat: boolean;
  isLoadingCreateRoomChat: boolean;
  isLoadingCreateChat: boolean;
  chat: ChatUserState[];
  isError: boolean;
};

const initialState: ChatState = {
  isLoading: false,
  isLoadingGetAllChat: false,
  isLoadingCreateRoomChat: false,
  isLoadingCreateChat: false,
  chat: [],
  isError: false,
};

const chatUserSlice = createSlice({
  name: "chatUser",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.chat.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChatofUser.pending, (state) => {
        state.isLoadingGetAllChat = true;
        state.isError = false;
      })
      .addCase(getAllChatofUser.fulfilled, (state, action) => {
        state.isLoadingGetAllChat = false;
        state.chat = action.payload;
        state.isError = false;
      })
      .addCase(getAllChatofUser.rejected, (state, action) => {
        state.isLoadingGetAllChat = false;
        state.isError = true;
      });

    builder
      .addCase(CreateChatRoom.pending, (state) => {
        state.isLoadingCreateRoomChat = true;
        state.isError = false;
      })
      .addCase(CreateChatRoom.fulfilled, (state, action) => {
        state.isLoadingCreateRoomChat = false;
        state.isError = false;
      })
      .addCase(CreateChatRoom.rejected, (state, action) => {
        state.isLoadingCreateRoomChat = false;
        state.isError = true;
      });
    builder
      .addCase(CreateChat.pending, (state) => {
        state.isLoadingCreateChat = true;
        state.isError = false;
      })
      .addCase(CreateChat.fulfilled, (state, action) => {
        state.isLoadingCreateChat = false;
        state.isError = false;
      })
      .addCase(CreateChat.rejected, (state, action) => {
        state.isLoadingCreateChat = false;
        state.isError = true;
      });
  },
});
export const { addMessage } = chatUserSlice.actions;
export default chatUserSlice.reducer;
