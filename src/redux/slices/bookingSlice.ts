import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
interface BookingData {
  id: string;
  scheduleDate: string;
  status: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  userId: string;
  userName: string;
  fullName: string;
  orderId: string;
}
interface UnavailableDate {
  scheduleDate: string;
}
interface BookingState {
  loading: boolean;
  error: string | null;
  bookingData: BookingData | null;
  unavailableDates: UnavailableDate[];
}

export const createBookingService = createAsyncThunk<BookingData, any, { rejectValue: string }>(
  "booking/createBookingService",
  async (bookingData: any, { rejectWithValue }) => {
    try {
      const response = await myAxios.post(`/booking/booking-schedule`, bookingData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error("Error creating booking:", error);
      return rejectWithValue(error.response?.data?.message || "Error creating booking");
    }
  }
);
export const getAllUnavailableDates = createAsyncThunk("booking/getAllUnavailableDates", async () => {
  try {
    const response = await myAxios.get(`/booking/date-unavailable`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
});

const initialState: BookingState = {
  loading: false,
  error: null,
  bookingData: null,
  unavailableDates: [],
};
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBookingService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingService.fulfilled, (state, action: PayloadAction<BookingData>) => {
        state.loading = false;
        state.error = null;
        state.bookingData = action.payload;
      })
      .addCase(createBookingService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(getAllUnavailableDates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUnavailableDates.fulfilled, (state, action: PayloadAction<UnavailableDate[]>) => {
        state.loading = false;
        state.unavailableDates = action.payload;
      })
      .addCase(getAllUnavailableDates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default bookingSlice.reducer;
