import React, { useCallback, useState } from "react";
import { FaCheck, FaTimes, FaClock, FaRegMoneyBillAlt } from "react-icons/fa";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { BookingList, CancelBooking } from "@redux/slices/bookingSlice";
import { useNavigate } from "react-router-dom";
import { currencyFormat, formatDate } from "@ultils/helper";
import { BaseBtnGreen } from "@styles/button";

import SimpleModal, { ModalContent, ModalHeader } from "@components/atom/modal/Modal";
import Loading from "@components/atom/Loading/Loading";
import { toast } from "react-toastify";
import { RefundBankModal } from "@components/atom/modal/RefundBankModal";
interface BookingItemListProps {
  bookings: BookingList[]; // Changed to an array of Order
}

const BookingHistory: React.FC<BookingItemListProps> = ({ bookings }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const isLoadingCancel = useAppSelector((state) => state.bookingService.isLoadingCancel);
  const [selectedBooking, setSelectedBooking] = useState<BookingList | null>(null);
  const openModalDelete = () => {
    setIsModalOpenDelete(true);
  };
  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;

    try {
      const res = await dispatch(
        CancelBooking({
          bookingid: selectedBookingId,
          reason: "huy",
        })
      ).unwrap();

      if (res.status === "200" || res.status === 200) {
        toast.success("Đơn dịch vụ đã được hủy!");
        setIsModalOpenDelete(false);
      }
    } catch (error) {
      toast.error(error as string);
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
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
        label: "Chưa bảo trì",
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
  // refund
  const openModal = (book: BookingList) => {
    setSelectedBooking(book);
    setShowRefundModal(true);
  };
  const closeModal = useCallback(() => {
    setShowRefundModal(false);
    setSelectedBooking(null);
  }, []);
  const [showRefundModal, setShowRefundModal] = useState(false);
  return (
    <>
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
                    <StatusTag status={booking.status} />
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
                        {/* các nút thao tác bookk */}
                        {booking.status === "NOTASSIGN" && (
                          <>
                            <button
                              className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition duration-200"
                              onClick={() => {
                                setSelectedBookingId(booking.id);
                                openModalDelete();
                              }}
                            >
                              Hủy đơn
                            </button>
                          </>
                        )}
                        {booking.status === "CANCELLED" && booking?.payment?.paymentStatus === "Completed" && (
                          <>
                            <button
                              className="bg-white border border-blue-600 rounded-lg px-4 py-2 transition duration-200 hover:bg-gray-100 "
                              onClick={() => openModal(booking)}
                            >
                              Yêu Cầu Hoàn Tiền
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <PaymentStatus status={booking?.payment.paymentStatus ?? "UNKNOWN"} />
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
        <div className="text-center text-gray-600 text-xl mt-6">Không có đơn đặt dịch vụ nào !!</div>
      )}
      <SimpleModal isOpen={isModalOpenDelete} onClose={closeModalDelete}>
        <ModalHeader></ModalHeader>
        <ModalContent>
          <h2 className="text-xl font-bold text-center">Hủy đơn hàng</h2>
          <p className="text-center text-gray-600 mt-2">Bạn có chắc chắn muốn hủy đơn dịch vụ này không?</p>
          <div className="flex justify-between mt-6">
            <button
              onClick={closeModalDelete}
              className="w-1/2 py-2 border border-red-600 text-red-600 font-semibold rounded-lg mr-2"
            >
              Không
            </button>
            <button
              className="w-1/2 py-2 bg-red-600 text-white font-semibold rounded-lg flex justify-center items-center"
              onClick={handleCancelBooking}
            >
              {isLoadingCancel ? <Loading /> : "Xác nhận "}
            </button>
          </div>
        </ModalContent>
      </SimpleModal>
      <RefundBankModal isOpen={showRefundModal} onClose={closeModal} booking={selectedBooking} />
    </>
  );
};

export default BookingHistory;
