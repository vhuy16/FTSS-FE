import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import myAxios from "@setup/axiosConfig";
import { SetupPackage } from "./setupSlice";
import { getAllOrdersByUsers } from "./orderListSlice";
import { getAllBookingofUsers, getDetailBookingofUsers } from "./bookingSlice";

type DataCheckOut = {
  cartItem: string[];
  shipCost: number;
  address: string;
  voucherId: string | null;
  paymentMethod: string;
  phoneNumber: string;
  recipientName: string;
  setupPackageId: string | null;
};
type UserResponse = {
  name: string;
  email: string;
  phoneNumber: string;
};
type Payment = {
  paymentId: string;
  paymentMethod: string;
  paymentStatus: string;
  bankNumber: string | null | "Unknown";
  bankName: string | null | "Unknown";
  bankHolder: string | null | "Unknown";
};

export type OrderDetail = {
  productName: string;
  price: number;
  quantity: number;
  linkImage: string;
  categoryName: string;
  subCategoryName: string;
};
type Voucher = {
  voucherCode: string;
  discountType: string;
  discount: number;
  maximumOrderValue: number;
};
type MediaFile = {
  id: string;
  mediaLink: string;
  mediaType: string;
};

type ReturnRequest = {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  mediaFiles: MediaFile[];
};
export type Order = {
  id: string;
  totalPrice: number;
  status: string;
  shipCost: number;
  createDate: string;
  modifyDate: string | null;
  address: string;
  phoneNumber: string | null;
  buyerName: string | null;
  discount: number;
  userResponse: UserResponse;
  orderDetails: OrderDetail[];
  payment: Payment;
  oderCode: string;
  setupPackage: SetupPackage | null;
  isAssigned: boolean;
  isEligible: boolean;
  voucher: Voucher | null;
  returnRequests: ReturnRequest[] | null;
  installationDate: string | null;
};
type initialStateProduct = {
  url: string;
  listOrder: Order[];
  order: Order | null;
  isLoading: boolean;
  isLoadingUpdate: boolean;
  isLoadingRefund: boolean;
  isLoadingRefunded: boolean;
  isLoadingGetAllOrder: boolean;
  isLoadingReturn: boolean;
  isLoadingUpdateScheduleSetup: boolean;
  isError: boolean;
};
export const createOrder = createAsyncThunk("order/create", async (data: DataCheckOut, { rejectWithValue }) => {
  try {
    const response = await myAxios.post("/order", data);
    return response.data.data.checkoutUrl;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Tạo đơn hàng thất bại");
  }
});
export const getAllOrder = createAsyncThunk("order/getAllOrder", async (_, { rejectWithValue }) => {
  try {
    const response = await myAxios.get("/order?page=1&size=100&isAscending=false");
    return response.data.data.orders;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Lấy đơn hàng thất bại");
  }
});
export const getOrderById = createAsyncThunk("order/getOrderById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await myAxios.get(`/order/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.response?.data?.message || "Lấy đơn hàng theo id thất bại");
  }
});
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await myAxios.put(`/order/${id}`, { status: status });
      await dispatch(getAllOrder());
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Cập nhật đơn hàng thất bại");
    }
  }
);
// cap nhat lich lap dat
export const updateScheduleSetup = createAsyncThunk(
  "order/updateScheduleSetup",
  async ({ id, date }: { id: string; date: string }, { rejectWithValue, dispatch }) => {
    try {
      // Tạo FormData để đúng định dạng multipart/form-data
      const formData = new FormData();
      formData.append("InstallationDate", date);

      const response = await myAxios.put(`/order/update-time/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await dispatch(getOrderById(id));
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Cập nhật đơn hàng thất bại");
    }
  }
);

export const refundOrder = createAsyncThunk(
  "order/refundOrder",
  async (
    {
      paymentId,
      bankNumber,
      bankName,
      bankHolder,
      orderId,
      bookingId,
    }: {
      paymentId: string;
      bankNumber: string;
      bankName: string;
      bankHolder: string;
      orderId?: string;
      bookingId?: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await myAxios.put(
        `payment/update-bank-infor?paymentId=${paymentId}&bankNumber=${bankNumber}&bankName=${bankName}&bankHolder=${bankHolder}`
      );
      const promises = [dispatch(getAllOrdersByUsers()), dispatch(getAllBookingofUsers())];

      if (orderId) {
        promises.push(dispatch(getOrderById(orderId)));
      }

      if (bookingId) {
        promises.push(dispatch(getDetailBookingofUsers(bookingId)));
      }

      await Promise.all(promises);

      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Cập nhật đơn hàng thất bại");
    }
  }
);
export const refundedOrder = createAsyncThunk(
  "order/refundedOrder",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await myAxios.put(`/update-status/${id}`, JSON.stringify("Refunded"), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      await dispatch(getAllOrder());
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);
export const returnOrder = createAsyncThunk(
  "order/returnOrder",
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await myAxios.post(`/order/create-return-request`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await dispatch(getAllOrdersByUsers());
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Yêu cầu hoàn trả thất bại");
    }
  }
);
const initialState: initialStateProduct = {
  url: "",
  listOrder: [],
  order: null,
  isLoading: false,
  isLoadingUpdate: false,
  isLoadingRefund: false,
  isLoadingRefunded: false,
  isLoadingGetAllOrder: false,
  isLoadingReturn: false,
  isLoadingUpdateScheduleSetup: false,
  isError: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.url = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(getAllOrder.pending, (state) => {
        state.isLoadingGetAllOrder = true;
        state.isError = false;
      })
      .addCase(getAllOrder.fulfilled, (state, action) => {
        state.isLoadingGetAllOrder = false;
        state.isError = false;
        state.listOrder = action.payload;
      })
      .addCase(getAllOrder.rejected, (state, action) => {
        state.isLoadingGetAllOrder = false;
        state.isError = true;
      });
    builder
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(updateOrder.pending, (state) => {
        state.isLoadingUpdate = true;
        state.isError = false;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isLoadingUpdate = false;
        state.isError = false;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoadingUpdate = false;
        state.isError = true;
      });
    builder
      .addCase(refundOrder.pending, (state) => {
        state.isLoadingRefund = true;
        state.isError = false;
      })
      .addCase(refundOrder.fulfilled, (state, action) => {
        state.isLoadingRefund = false;
        state.isError = false;
      })
      .addCase(refundOrder.rejected, (state, action) => {
        state.isLoadingRefund = false;
        state.isError = true;
      });
    builder
      .addCase(refundedOrder.pending, (state) => {
        state.isLoadingRefunded = true;
        state.isError = false;
      })
      .addCase(refundedOrder.fulfilled, (state, action) => {
        state.isLoadingRefunded = false;
        state.isError = false;
      })
      .addCase(refundedOrder.rejected, (state, action) => {
        state.isLoadingRefunded = false;
        state.isError = true;
      });
    builder
      .addCase(returnOrder.pending, (state) => {
        state.isLoadingReturn = true;
        state.isError = false;
      })
      .addCase(returnOrder.fulfilled, (state, action) => {
        state.isLoadingReturn = false;
        state.isError = false;
      })
      .addCase(returnOrder.rejected, (state, action) => {
        state.isLoadingReturn = false;
        state.isError = true;
      });
    builder
      .addCase(updateScheduleSetup.pending, (state) => {
        state.isLoadingUpdateScheduleSetup = true;
        state.isError = false;
      })
      .addCase(updateScheduleSetup.fulfilled, (state, action) => {
        state.isLoadingUpdateScheduleSetup = false;
        state.isError = false;
      })
      .addCase(updateScheduleSetup.rejected, (state, action) => {
        state.isLoadingUpdateScheduleSetup = false;
        state.isError = true;
      });
  },
});
export default orderSlice.reducer;
