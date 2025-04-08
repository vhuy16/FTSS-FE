import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaClock, FaStar } from "react-icons/fa";
import styled from "styled-components";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { Container } from "@styles/styles";
import { UserContent, UserDashboardWrapper } from "@styles/user";
import UserMenu from "@components/atom/user/UserMenu";
import Breadcrumb from "@common/Breadcrumb";
import Title from "@common/Title";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllBookingofUsers } from "@redux/slices/bookingSlice";
import { getUserProfile } from "@redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import beca from "@images/beca.jpg";
import { currencyFormat, formatDate } from "@ultils/helper";
import { BaseBtnGreen } from "@styles/button";
import { getOrderById } from "@redux/slices/orderSlice";
import LoadingPage from "@components/atom/Loading/LoadingPage";

const WishListScreenWrapper = styled.main`
  .wishlist {
    gap: 20px;
  }
`;

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Danh sách bảo trì", link: "/booking-history" },
];
const BookingHistory = () => {
  const bookings = useAppSelector((state) => state.bookingService.bookingList) || [];
  const isLoadingBooking = useAppSelector((state) => state.bookingService.loading);
  const isLoadingProfile = useAppSelector((state) => state.userProfile.isLoading);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getAllBookingofUsers());
  }, []);
  const navigate = useNavigate();

  console.log("booking", bookings);
  const PaymentStatus = ({ status }: { status: string }) => (
    <div
      className={`flex items-center gap-1 ${
        status === "PAID" || status === "REFUNDED"
          ? "text-green-600"
          : status === "FREE"
          ? "text-yellow-600"
          : status === "NOTPAID"
          ? "text-red-600"
          : status === "REFUNDING"
          ? "text-gray-500"
          : status === "CANCEL"
          ? "text-red-600"
          : "text-green-600"
      }`}
    >
      {status === "PAID" || status === "REFUNDED" || status === "FREE" ? (
        <FaCheck />
      ) : status === "NOTPAID" || status === "CANCEL" ? (
        <FaTimes />
      ) : status === "REFUNDING" ? (
        <FaClock />
      ) : null}
      <span className="font-medium">
        {status === "PAID"
          ? "Đã thanh toán"
          : status === "NOTPAID"
          ? "Chưa thanh toán"
          : status === "FREE"
          ? "Miễn phí"
          : status === "REFUNDED"
          ? "Đã hoàn tiền"
          : status === "REFUNDING"
          ? "Đang hoàn tiền"
          : status === "CANCEL"
          ? "Đã huỷ"
          : "Không xác định"}
      </span>
    </div>
  );

  const StatusTag = ({ status }: { status: string | null }) => {
    const statusConfig: {
      [key: string]: {
        bg: string;
        text: string;
        icon: JSX.Element;
        label: string;
      };
    } = {
      Done: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FaCheck className="inline-block mr-1" />,
        label: "Hoàn thành",
      },
      NotStarted: {
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
      Processing: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <FaClock className="inline-block mr-1" />,
        label: "Đã phân công",
      },
      Cancel: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <FaTimes className="inline-block mr-1" />,
        label: "Đã hủy",
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

  return (
    <WishListScreenWrapper className="page-py-spacing">
      {isLoadingBooking && isLoadingProfile ? (
        <LoadingPage />
      ) : (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <UserDashboardWrapper>
            <UserMenu />
            <UserContent>
              <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
                <Title titleText={"Danh sách bảo trì"} />
                {bookings && Array.isArray(bookings) && bookings.length > 0 ? (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                            <div>
                              <StatusTag status={booking.missionStatus} />
                              <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mt-2">
                                Mã dịch vụ : #{booking.bookingCode}
                              </h2>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {booking.totalPrice ? currencyFormat(booking.totalPrice) : "0 ₫"}
                            </div>
                          </div>

                          <div className="flex flex-wrap md:flex-nowrap gap-6">
                            <div className="w-full md:w-3/4">
                              <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Ngày bảo trì</p>
                                <p className="font-bold text-xl">{formatDate(booking.scheduleDate)}</p>
                              </div>
                              <div className="flex justify-between mb-4">
                                <div className="flex items-start gap-12 mb-4">
                                  <p className="font-bold text-xl text-gray-900">Danh sách dịch vụ</p>
                                  {booking.services?.length === 0 ? (
                                    <p className="text-gray-600">Có tất cả dịch vụ trong gói bảo trì</p>
                                  ) : (
                                    <div className="flex flex-col gap-3">
                                      {booking.services?.map((ser) => (
                                        <p className="text-xl text-gray-600 mb-1">{ser.serviceName}</p> // Thêm `key={ser}` để tránh lỗi React key
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-3">
                                  <BaseBtnGreen onClick={() => navigate(`/booking-detail/${booking.id}`)}>
                                    Xem chi tiết
                                  </BaseBtnGreen>
                                </div>
                              </div>
                              <PaymentStatus status={booking.status} />
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-gray-600 border-t pt-4">
                            Cảm ơn bạn đã đặt dịch vụ bảo trì của chúng tôi.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-600 text-xl mt-6">Không có setup nào. Vui lòng tạo !!</div>
                )}
              </div>
            </UserContent>
          </UserDashboardWrapper>
        </Container>
      )}
    </WishListScreenWrapper>
  );
};

export default BookingHistory;
