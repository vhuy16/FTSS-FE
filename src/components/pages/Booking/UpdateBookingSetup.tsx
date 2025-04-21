import { useEffect, useState } from "react";
import { FaClock, FaWater, FaFish, FaCheck, FaTimes, FaRegMoneyBillAlt, FaTruck, FaBoxOpen } from "react-icons/fa";
import { BookingContainer, BookingServiceStyle, CalendarContainer, InfoWrapper } from "./BookingServiceStyle";
import { Container, HorizontalLine, HorizontalLineTAb } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { Order } from "@redux/slices/orderListSlice";
import BookingInfo from "./BookingInfo";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { Box } from "@mui/material";
import { getAllServices, ServicePackage } from "@redux/slices/listServiceSlice";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { currencyFormat, formatDate } from "@ultils/helper";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, updateScheduleSetup } from "@redux/slices/orderSlice";
import { toast } from "react-toastify";
import { createBookingService, getAllUnavailableDates } from "@redux/slices/bookingSlice";
import { BaseBtnGreen } from "@styles/button";
import Loading from "@components/atom/Loading/Loading";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import styled from "styled-components";
import { addDays, startOfWeek } from "date-fns";
import "dayjs/locale/vi"; // Import locale
import FormSchedule from "@components/atom/FormSchedule/FormSchedule";
dayjs.locale("vi"); // Set default locale
const OrderDetailScreenWrapper = styled.main`
  .order-summary {
    width: 100%;
    margin-top: 2.5rem;
  }

  .order-summary table {
    width: 100%;
    border-collapse: collapse;
  }

  .order-summary td {
    padding: 8px 0;
    text-align: right;
    border-bottom: 1px solid #ddd;
  }

  .order-summary tr:last-child td {
    border-bottom: none;
  }

  .order-summary .text-red-500 {
    color: #fd053b;
  }

  .order-summary .text-gray-500 {
    color: #6b7280;
  }

  .order-summary .font-bold {
    font-weight: bold;
  }
`;
const UpdateBookingSetup = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const orderDetail = useAppSelector((state) => state.order.order);
  const isLoadingDetail = useAppSelector((state) => state.order.isLoading);
  const isLoadingUpdateScheduleSetup = useAppSelector((state) => state.order.isLoadingUpdateScheduleSetup);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getOrderById(orderId as string));
  }, [dispatch]);

  const products = orderDetail?.setupPackage?.products;
  const subtotal = products?.reduce((acc, product) => {
    const quantity = product.quantity ?? 0;
    const price = product.price ?? 0;
    return acc + quantity * price;
  }, 0);
  console.log("detail", orderDetail);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Cập nhật lịch lắp đặt", link: `/booking-setup-schedule/${orderId}` },
  ];
  const StatusTag = ({ status }: { status: string | null }) => {
    const statusConfig: {
      [key: string]: {
        bg: string;
        text: string;
        icon: JSX.Element;
        label: string;
      };
    } = {
      COMPLETED: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FaBoxOpen className="inline-block mr-1" />,
        label: "Đã giao hàng",
      },
      PROCESSING: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: <FaClock className="inline-block mr-1" />,
        label: "Đang xử lý",
      },
      RETURNING: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: <FaClock className="inline-block mr-1" />,
        label: "Đang yêu cầu trả hàng",
      },
      PROCESSED: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FaCheck className="inline-block mr-1" />,
        label: "Đã xử lý",
      },
      CANCELLED: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <FaTimes className="inline-block mr-1" />,
        label: "Đã hủy",
      },
      RETURNED: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FaRegMoneyBillAlt className="inline-block mr-1" />,
        label: "Trả hàng",
      },
      PENDING_DELIVERY: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FaTruck className="inline-block mr-1" />,
        label: "Chờ giao hàng",
      },
    };

    const config = statusConfig[status ?? "null"];

    if (!config) return null;

    return (
      <span
        className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm font-medium flex items-center w-fit`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };
  const PaymentStatus = ({ status }: { status: string }) => (
    <div
      className={`flex items-center gap-1 ${
        status === "Completed" || status === "Refunded"
          ? "text-green-600"
          : status === "Processing" || status === "Refunding"
          ? "text-gray-500"
          : status === "Cancelled"
          ? "text-red-600"
          : "text-gray-600"
      }`}
    >
      {status === "Completed" ? (
        <FaCheck />
      ) : status === "Cancelled" ? (
        <FaTimes />
      ) : status === "Processing" || status === "Refunding" ? (
        <FaClock />
      ) : status === "Refunded" ? (
        <FaRegMoneyBillAlt />
      ) : null}
      <span className="font-medium">
        {status === "Completed"
          ? "Đã thanh toán"
          : status === "Cancelled"
          ? "Đã huỷ"
          : status === "Processing"
          ? "Đang chờ thanh toán"
          : status === "Refunded"
          ? "Đã hoàn tiền"
          : status === "Refunding"
          ? "Đang hoàn tiền"
          : "Không xác định"}
      </span>
    </div>
  );
  console.log("ngay gui di ", selectedSchedule);
  const handleSave = async () => {
    if (!selectedSchedule) {
      toast("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await dispatch(updateScheduleSetup({ id: orderId ?? "", date: selectedSchedule }));

      const data = response.payload;

      if (response.meta.requestStatus === "fulfilled" && (data?.status === "200" || data?.status === "201")) {
        toast.success("Cập nhật lịch bảo trì thành công");
        navigate(`/order-detail/${orderId}`);
      } else {
        toast.error(data || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch bảo trì:", error);
      toast.error("Lưu thất bại, vui lòng thử lại.");
    }
  };

  return (
    <BookingServiceStyle>
      {isLoadingDetail ? (
        <LoadingPage />
      ) : (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <div className="bookingContainer">
            <div className="order-d-top flex justify-between items-start ">
              {/* Bên trái */}
              <div className="order-d-top-l w-2/3 pr-4">
                <h4 className="text-3xl order-d-no mb-2">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Mã đặt hàng:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-500 ">
                      {orderDetail?.oderCode}
                    </span>
                  </div>
                </h4>
                <p className="text-lg font-medium text-gray mb-1">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Ngày đặt:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {formatDate(orderDetail?.createDate || "")}
                    </span>
                  </div>
                </p>
                <p className="text-lg font-medium text-gray mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Trạng thái đơn hàng:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      <StatusTag status={orderDetail?.status ?? "UNKNOWN"} />
                    </span>
                  </div>
                </p>
                <p className="text-lg font-medium text-gray mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Trạng thái thanh toán:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      <PaymentStatus status={orderDetail?.payment?.paymentStatus ?? "UNKNOWN"} />
                    </span>
                  </div>
                </p>

                <p className="text-lg font-medium text-gray">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Phương thức thanh toán:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {orderDetail?.payment?.paymentMethod === "COD"
                        ? "Thanh toán khi nhận hàng"
                        : orderDetail?.payment?.paymentMethod}
                    </span>
                  </div>
                </p>
              </div>
              {/* Bên phải */}
              <div className="order-d-top-r w-1/3 pl-4">
                <p className="text-lg font-medium text-gray mb-1">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Người nhận:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {orderDetail?.buyerName}
                    </span>
                  </div>
                </p>

                <p className="text-lg font-medium text-gray mb-1">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Địa chỉ:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {orderDetail?.address}
                    </span>
                  </div>
                </p>

                <p className="text-lg font-medium text-gray mb-1">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">SĐT:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {orderDetail?.phoneNumber}
                    </span>
                  </div>
                </p>
              </div>
            </div>
            <HorizontalLine />
            {/* //date time  */}
            <FormSchedule setSelectedSchedule={setSelectedSchedule} />
            <HorizontalLine />
            <div className="flexContainer">
              <div className="build-info">
                <h1 className="title">{orderDetail?.setupPackage?.setupName}</h1>
                <div className="iconText">
                  {/* <FaWater className="icon" /> */}
                  <span>Size: {orderDetail?.setupPackage?.size}</span>
                </div>
                <p className="description">Mô tả: {orderDetail?.setupPackage?.description}</p>
              </div>
            </div>
            <div className="product">
              <h2 className="sectionTitle">Sản phẩm</h2>
              <div className="productContainer">
                {products?.map((product) => (
                  <div key={product.id} className="productCard">
                    <img src={product.images} alt={product.productName} className="productImage" />
                    <h3 className="productName">{product.productName}</h3>
                    <p className="productDescription">Số lượng: {product.quantity}</p>
                    <p className="productPrice">{currencyFormat(product.price)}</p>
                  </div>
                ))}
              </div>
            </div>
            <OrderDetailScreenWrapper>
              <div className="order-summary">
                <table className="w-full border-separate border-spacing-y-2">
                  <tbody>
                    <tr>
                      <td className="text-right text-gray-500">Tổng phụ</td>
                      <td className="text-right">{currencyFormat(subtotal ?? 0)}</td>
                    </tr>
                    <tr>
                      <td className="text-right text-gray-500">Giảm giá</td>
                      <td className="text-right">
                        -
                        {currencyFormat(
                          (subtotal ?? 0) + (orderDetail?.shipCost ?? 0) - (orderDetail?.totalPrice ?? 0)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-right text-gray-500">Phí vận chuyển</td>
                      <td className="text-right">{currencyFormat(orderDetail?.shipCost ?? 0)}</td>
                    </tr>
                    <tr className="border-t border-gray-300">
                      <td className="text-right font-bold">Thành tiền</td>
                      <td className="text-right text-4xl font-bold text-red-500">
                        {currencyFormat(orderDetail?.totalPrice ?? 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </OrderDetailScreenWrapper>
            <HorizontalLine />
            <BaseBtnGreen
              disabled={!selectedSchedule}
              className={`bookButton ${selectedSchedule ? "enabled" : "disabled"}`}
              onClick={handleSave}
            >
              {isLoadingUpdateScheduleSetup ? <Loading /> : "Đặt lịch "}
            </BaseBtnGreen>
          </div>
        </Container>
      )}
    </BookingServiceStyle>
  );
};

export default UpdateBookingSetup;
