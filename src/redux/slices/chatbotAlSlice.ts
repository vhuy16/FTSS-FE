import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ChatResponse {
  response: string;
  tip: string;
}

interface ChatState {
  data: ChatResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  data: null,
  loading: false,
  error: null,
};

export const sendChatbotAlMessage = createAsyncThunk<ChatResponse, string, { rejectValue: string }>(
  "chat/sendMessage",
  async (message, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://chatbot-q6c1jhq1r-self-check-out.vercel.app/chat",
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data as ChatResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Unknown error");
    }
  }
);

const chatbotAlSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatResponse: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatbotAlMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatbotAlMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(sendChatbotAlMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export const { clearChatResponse } = chatbotAlSlice.actions;
export default chatbotAlSlice.reducer;
