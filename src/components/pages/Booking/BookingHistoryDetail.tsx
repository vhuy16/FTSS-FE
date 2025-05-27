import { useCallback, useEffect, useState } from "react";
import { FaClock, FaTimes, FaCheck } from "react-icons/fa";
import { Container, HorizontalLine } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { currencyFormat, formatDate } from "@ultils/helper";
import { useParams } from "react-router-dom";
import { getOrderById } from "@redux/slices/orderSlice";
import { BookingDetail, getDetailBookingofUsers } from "@redux/slices/bookingSlice";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import { BookingServiceStyle } from "./BookingServiceStyle";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import styled from "styled-components";
import { BaseButtonGreen, BaseButtonWhite } from "@styles/button";
import { RefundBankModal } from "@components/atom/modal/RefundBankModal";
import UpdateBookingModal from "@components/atom/modal/UpdateBookingModal";
import { ConfirmModal } from "@components/atom/modal/ConfirmModal";
import ChatboxWidget from "@components/atom/ChatWidget/ChatWidget";
const BookingDetailMessageWrapper = styled.div`
  background-color: ${defaultTheme.color_lighwhite};
  max-width: 100%;
  margin: 0 auto;
  min-height: 68px;
  padding: 16px 24px;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Tạo khoảng cách giữa các phần tử */
  align-items: flex-start;

  /* Tạo mũi tên chỉ xuống */

  /* Responsive chỉnh khoảng cách trên */
  @media (max-width: ${breakpoints.sm}) {
    margin-top: 10px;
  }

  /* Căn chỉnh layout phù hợp với ảnh */
  .order-message-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .order-buttons {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-end;
    width: 100%;
  }

  .order-buttons button {
    width: 236px;
    padding: 20px;
    border-radius: 6px;
    border: 0.5px;
    font-size: 14px;
    cursor: pointer;
  }

  .request-button {
    border: 1px solid ${defaultTheme.color_gray};
    color: black;
    background-color: white;
  }
`;

const BookingHistoryDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const bookingDetail = useAppSelector((state) => state.bookingService.bookingDetail);
  const orderDetail = useAppSelector((state) => state.order.order);
  const isLoadingDetail = useAppSelector((state) => state.order.isLoading);
  const isLoadingBooking = useAppSelector((state) => state.bookingService.loading);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [selectedBookingReport, setSelectedBookingReport] = useState<BookingDetail | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getDetailBookingofUsers(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    if (bookingDetail?.orderId) {
      dispatch(getOrderById(bookingDetail.orderId));
    }
  }, [dispatch, bookingDetail?.orderId]);
  const products = orderDetail?.setupPackage?.products;

  console.log("Booking", bookingDetail);

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Đặt lịch", link: "/booking" },
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
      DONE: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FaCheck className="inline-block mr-1" />,
        label: "Hoàn thành bảo trì",
      },
      COMPLETED: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FaCheck className="inline-block mr-1" />,
        label: "Đã bảo trì",
      },
      NOTASSIGN: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: <FaClock className="inline-block mr-1" />,
        label: "Chưa bắt đầu",
      },
      null: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: <FaClock className="inline-block mr-1" />,
        label: "Chưa bắt đầu",
      },
      ASSIGNED: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <FaCheck className="inline-block mr-1" />,
        label: "Đã phân công",
      },
      PROCESSING: {
        bg: "bg-blueb-100",
        text: "text-blue-800",
        icon: <FaClock className="inline-block mr-1" />,
        label: "Đang tiến hành",
      },
      CANCELLED: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <FaTimes className="inline-block mr-1" />,
        label: "Đã hủy",
      },
      MISSED: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <FaTimes className="inline-block mr-1" />,
        label: "Không thực hiện được",
      },
      NOTDONE: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <FaTimes className="inline-block mr-1" />,
        label: "Chưa xong",
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
  // refund and update
  const openModal = (book: BookingDetail) => {
    setSelectedBooking(book);
    setShowRefundModal(true);
  };
  const closeModal = useCallback(() => {
    setShowRefundModal(false);
    setSelectedBooking(null);
  }, []);
  const openModalUpdate = (book: BookingDetail) => {
    setSelectedBooking(book);
    setShowUpdateModal(true);
  };
  const closeModalUpdate = useCallback(() => {
    setShowUpdateModal(false);
    setSelectedBooking(null);
  }, []);

  // confirm

  const openModalConfirm = (book: BookingDetail) => {
    setSelectedBooking(book);
    setShowConfirmModal(true);
  };
  const closeModalConfirm = useCallback(() => {
    setShowConfirmModal(false);
    setSelectedBooking(null);
  }, []);

  //chat

  const openChatboxWithOrder = (book: BookingDetail) => {
    setShowChatModal(true); // Mở chatbox
    setSelectedBookingReport(book);
  };
  const closeModalChat = useCallback(() => {
    setShowChatModal(false);
    setSelectedBookingReport(null);
  }, []);

  return (
    <BookingServiceStyle>
      {isLoadingDetail && isLoadingBooking ? (
        <LoadingPage />
      ) : orderDetail ? (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <div className="booking">
            <div className="flexContainer">
              <div className="build-info">
                <h1 className="title">
                  <span className="text-title">Mã dịch vụ: </span> #{bookingDetail?.bookingCode}
                </h1>
                <div className="iconText">
                  {/* <FaWater className="icon" /> */}
                  <p className="flex justify-center gap-3">
                    <span className="text-title">Trạng thái: </span>{" "}
                    <span>
                      <StatusTag status={bookingDetail?.status ?? null} />
                    </span>
                  </p>
                </div>
                <p className="description">
                  <span className="text-title">Ngày bảo trì: </span>{" "}
                  {bookingDetail?.scheduleDate ? formatDate(bookingDetail.scheduleDate) : "Chưa có ngày"}
                </p>
              </div>
              <div className="customer-info">
                <div className="title">Thông tin người đặt dịch vụ</div>
                <p className="description">
                  <span className="text-title">Tên: </span> {bookingDetail?.fullName}
                </p>
                <p className="description">
                  <span className="text-title">SĐT: </span> {bookingDetail?.phoneNumber}
                </p>
                <p className="description">
                  <span className="text-title">Địa chỉ: </span> {bookingDetail?.address}
                </p>
              </div>
            </div>
            {bookingDetail?.status === "CANCELLED" && bookingDetail?.payment?.paymentStatus === "Completed" && (
              <BookingDetailMessageWrapper>
                <div className="order-message-content">
                  <p className="font-semibold">"Vui lòng nhấn yêu cầu hoàn tiền để gửi thông tin hoàn tiền".</p>
                </div>
                <div className="order-buttons">
                  <BaseButtonWhite className="request-button" onClick={() => openModal(bookingDetail)}>
                    Yêu Cầu Hoàn Tiền
                  </BaseButtonWhite>
                </div>
              </BookingDetailMessageWrapper>
            )}
            {bookingDetail?.status === "DONE" && (
              <BookingDetailMessageWrapper>
                <div className="order-message-content">
                  <p className="font-semibold">
                    "Vui lòng kiểm tra đơn bảo trì cho bể cá của bạn và nhấn hoàn thành!!".
                  </p>
                </div>
                <div className="order-buttons">
                  <BaseButtonGreen onClick={() => openModalConfirm(bookingDetail)}>Hoàn thành</BaseButtonGreen>
                  <BaseButtonWhite className="request-button" onClick={() => openChatboxWithOrder(bookingDetail)}>
                    Báo cáo/Khiếu nại
                  </BaseButtonWhite>
                </div>
              </BookingDetailMessageWrapper>
            )}
            {bookingDetail?.status === "NOTASSIGN" && (
              <div className="flex justify-end pr-12">
                <BaseButtonGreen
                  className="request-button px-6 py-2 text-sm font-medium  rounded hover:bg-green-500 transition"
                  onClick={() => openModalUpdate(bookingDetail)}
                >
                  Cập nhật thông tin bảo trì
                </BaseButtonGreen>
              </div>
            )}
            {bookingDetail?.status === "NOTDONE" && (
              <div className="flex justify-end pr-12">
                <BaseButtonGreen
                  className="request-button px-6 py-2 text-sm font-medium  rounded hover:bg-green-500 transition"
                  onClick={() => openModalUpdate(bookingDetail)}
                >
                  Cập nhật thông tin bảo trì
                </BaseButtonGreen>
              </div>
            )}
            <HorizontalLine />
            <div className="setup">
              <div className="flexContainer">
                <div className="build-info">
                  <h1 className="title-setup">{orderDetail?.setupPackage?.setupName}</h1>
                  <div className="iconText">
                    {/* <FaWater className="icon" /> */}
                    <p>
                      {" "}
                      <span className="text-title">Size: </span> {orderDetail?.setupPackage?.size}
                    </p>
                  </div>
                  <p className="description">
                    <span className="text-title">Mô tả: </span> {orderDetail?.setupPackage?.description}
                  </p>
                </div>
              </div>
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
            <HorizontalLine />
            <div className="service">
              <h2 className="sectionTitle">Dịch vụ</h2>
              <div className="serviceGrid">
                {bookingDetail?.services?.map((service) => (
                  <button key={service.id} className={`serviceButton selected`}>
                    <div className="service-name">{service.serviceName}</div>
                    <div className="service-price">{currencyFormat(service.price)}</div>
                  </button>
                ))}
              </div>
            </div>
            <HorizontalLine />
            <div className="flex justify-center items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-100 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Chi tiết thanh toán</h3>
                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4"></div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Tổng tiền</p>
                  <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                    {currencyFormat(bookingDetail?.totalPrice ?? 0)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-100 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Thanh toán</h3>
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center w-full space-y-4 flex-col  pb-4">
                    <div className="flex justify-between w-full">
                      <p className="text-base dark:text-white leading-4 text-gray-800">Phương thức thanh toán</p>
                      <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                        {bookingDetail?.payment.paymentMethod === "FREE"
                          ? "Sử dụng gói bảo trì"
                          : bookingDetail?.payment.paymentMethod}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base dark:text-white leading-4 text-gray-800">Trạng thái thanh toán</p>
                      <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                        {bookingDetail?.payment.paymentStatus == "Processing"
                          ? "Đang chờ thanh toán"
                          : bookingDetail?.payment.paymentStatus == "Completed"
                          ? "Đã thanh toán"
                          : bookingDetail?.payment.paymentStatus == "Cancelled"
                          ? "Đã huỷ"
                          : bookingDetail?.payment.paymentStatus == "Refunding"
                          ? "Đang hoàn tiền"
                          : bookingDetail?.payment.paymentStatus == "Refunded"
                          ? "Đã hoàn tiền"
                          : "Dùng gói bảo trì"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RefundBankModal isOpen={showRefundModal} onClose={closeModal} booking={selectedBooking} />
          <ConfirmModal isOpen={showConfirmModal} onClose={closeModalConfirm} booking={selectedBooking} />
          <UpdateBookingModal
            isModalUpdateOpen={showUpdateModal}
            onClose={closeModalUpdate}
            booking={selectedBooking}
          />
          <ChatboxWidget
            isOpen={showChatModal}
            onClose={closeModalChat}
            booking={selectedBookingReport}
            setIsOpen={setShowChatModal}
          />
        </Container>
      ) : (
        <LoadingPage></LoadingPage>
      )}
    </BookingServiceStyle>
  );
};

export default BookingHistoryDetail;
