import PropTypes from "prop-types";
import OrderItem from "./OrderItem";
import { getAllOrdersByUsers, Order } from "@redux/slices/orderListSlice";
import { breakpoints } from "@styles/themes/default";
import styled from "styled-components";
import { BaseBtnGreen } from "@styles/button";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "@ultils/helper";
import { HorizontalLineTAb } from "@styles/styles";
import SimpleModal, { ModalContent, ModalHeader } from "@components/atom/modal/Modal";
import Loading from "@components/atom/Loading/Loading";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { updateOrder } from "@redux/slices/orderSlice";
import { toast } from "react-toastify";
import { RefundBankModal } from "@components/atom/modal/RefundBankModal";
import { FaBoxOpen, FaCheck, FaClock, FaRegMoneyBillAlt, FaTimes, FaTruck } from "react-icons/fa";
import { ReturnOrderModal } from "@components/atom/modal/ReturnOrderModal";

interface OrderItemListProps {
  orders: Order[]; // Changed to an array of Order
}
const OrderItemListWrapper = styled.div`
  margin: 30px 0;
  .order-items {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 18px;
  }
  .order-item-title {
    margin-bottom: 12px;
  }

  .order-item-details {
    padding: 24px 32px;
    border-radius: 8px;

    @media (max-width: ${breakpoints.sm}) {
      padding: 20px 24px;
    }

    @media (max-width: ${breakpoints.xs}) {
      padding: 12px 16px;
    }
  }

  .order-info-group {
    margin-top: 30px;
    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
    }
  }

  .order-info-item {
    width: 50%;

    span {
      &:nth-child(2) {
        margin-left: 4px;
      }
    }

    &:nth-child(even) {
      text-align: right;
      @media (max-width: ${breakpoints.lg}) {
        text-align: left;
      }
    }

    @media (max-width: ${breakpoints.sm}) {
      width: 100%;
      margin: 2px 0;
    }
  }

  .order-overview {
    margin: 28px 0;
    gap: 12px;

    @media (max-width: ${breakpoints.lg}) {
      margin: 20px 0;
    }

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
    }

    &-img {
      width: 100px;
      height: 100px;
      border-radius: 6px;
      overflow: hidden;
    }

    &-content {
      grid-template-columns: 100px auto;
      gap: 18px;
    }

    &-info {
      ul {
        span {
          &:nth-child(2) {
            margin-left: 4px;
          }
        }
      }
    }
  }
  .order-items-last {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }

  .total-price {
    text-align: right;
    flex-shrink: 0;
    font-size: 18px;
    font-weight: bold;
    margin-top: 18px;
  }

  .total-price-text {
    color: #ee4d2d;
    font-size: 25px;
    margin-left: 10px;
  }

  .order-btn {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  .order-btn button {
    padding: 10px 30px;
    font-size: 18px;
    border-radius: 4px;
  }
  .btn-primary {
    background-color: #ee4d2d;
    color: white;
    border: none;
  }
  .btn-secondary {
    background-color: white;
    border: 1px solid #ccc;
  }
  .btn-third {
    background-color: #d0011b;
    color: white;
    border: none;
  }
  .btn-dropdown {
    background-color: white;
    border: 1px solid #ccc;
  }
`;

const OrderItemList: React.FC<OrderItemListProps> = ({ orders }) => {
  const navigate = useNavigate();
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const isLoadingUpdate = useAppSelector((state) => state.order.isLoadingUpdate);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const dispatch = useAppDispatch();
  const openModalDelete = () => {
    setIsModalOpenDelete(true);
  };
  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      const res = await dispatch(updateOrder({ id: selectedOrderId, status: "CANCELLED" }));
      const data = res.payload;

      // setOrder(res.payload as Order);
      if (res.meta.requestStatus === "fulfilled" && (data?.status === "200" || data?.status === "201")) {
        toast.success("Đơn hàng đã được hủy!");
        setIsModalOpenDelete(false);
        await dispatch(getAllOrdersByUsers());
      } else {
        toast.error(data || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại!");
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };
  // refund
  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setShowRefundModal(true);
  };
  const closeModal = () => setShowRefundModal(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  //return order
  const openModalReturn = (order: Order) => {
    setSelectedOrder(order);
    setShowReturnModal(true);
  };
  const closeModalReturn = () => setShowReturnModal(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

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
      NOTDONE: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <FaTimes className="inline-block mr-1" />,
        label: "Chưa lắp đặt",
      },
      DONE: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FaCheck className="inline-block mr-1" />,
        label: "Đã lắp đặt",
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

  return (
    <OrderItemListWrapper>
      {orders?.map((order) => (
        <div className="order-items" key={order.id}>
          {/* Hiển thị thông tin đơn hàng */}
          <div className="order-item-details">
            <StatusTag status={order.status} />
            <div className="flex justify-between items-center pb-5 mt-4">
              <div>
                <h3 className="text-gray-800 order-item-title font-bold">Mã đơn hàng: {order.oderCode}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold mr-2">Trạng thái thanh toán</span>
                  <span className="px-3 py-1 rounded-md text-xl font-medium ">
                    <PaymentStatus status={order?.payment?.paymentStatus ?? "UNKNOWN"} />
                  </span>
                </div>
              </div>
              <BaseBtnGreen onClick={() => navigate(`/order-detail/${order.id}`)}>Xem chi tiết</BaseBtnGreen>
            </div>
            <HorizontalLineTAb></HorizontalLineTAb>
          </div>
          {/* Hiển thị danh sách sản phẩm của đơn hàng */}
          {order.orderDetails?.map((item, index) => (
            <OrderItem key={`${order.id}-${index}`} order={order} item={item} />
          ))}
          <HorizontalLineTAb></HorizontalLineTAb>
          <div className="order-items-last">
            {/* Tổng tiền */}
            <div className="total-price">
              Thành tiền: <span className="total-price-text">{currencyFormat(order.totalPrice)}</span>
            </div>
            {/* Các nút thao tác */}
            <div className="order-btn">
              {order.status === "PROCESSING" && order.setupPackage != null && (
                <>
                  <button className="btn-secondary" onClick={() => navigate(`/booking-setup-schedule/${order?.id}`)}>
                    Cập nhật lịch lắp đặt
                  </button>
                </>
              )}
              {order.status === "NOTDONE" && order.setupPackage != null && (
                <>
                  <button className="btn-secondary" onClick={() => navigate(`/booking-setup-schedule/${order?.id}`)}>
                    Cập nhật lịch lắp đặt
                  </button>
                </>
              )}
              {order.status === "CANCELLED" && order?.payment?.paymentStatus === "Completed" && (
                <>
                  <button className="btn-secondary" onClick={() => openModal(order)}>
                    Yêu Cầu Hoàn Tiền
                  </button>
                </>
              )}
              {order.status === "RETURNED" && order?.payment?.paymentStatus === "Completed" && (
                <>
                  <button className="btn-secondary" onClick={() => openModal(order)}>
                    Yêu Cầu Hoàn Tiền
                  </button>
                </>
              )}
              {order.status === "PROCESSING" && (
                <>
                  <button
                    className="btn-third"
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      openModalDelete();
                    }}
                  >
                    Hủy đơn
                  </button>
                </>
              )}
              {order.status === "COMPLETED" && (
                <>
                  {order.setupPackage ? (
                    <button className="btn-primary" onClick={() => navigate(`/setup-booking/${order.id}`)}>
                      Đặt Lịch bảo trì
                    </button>
                  ) : (
                    <></>
                  )}
                </>
              )}
              {order.status === "COMPLETED" &&
                order?.payment?.paymentStatus === "Completed" &&
                order.isAssigned == true && (
                  <>
                    <button className="btn-secondary" onClick={() => openModalReturn(order)}>
                      Yêu cầu hoàn trả
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      ))}
      <SimpleModal isOpen={isModalOpenDelete} onClose={closeModalDelete}>
        <ModalHeader></ModalHeader>
        <ModalContent>
          <h2 className="text-xl font-bold text-center">Hủy đơn hàng</h2>
          <p className="text-center text-gray-600 mt-2">Bạn có chắc chắn muốn hủy đơn hàng không?</p>
          <div className="flex justify-between mt-6">
            <button
              onClick={closeModalDelete}
              className="w-1/2 py-2 border border-red-600 text-red-600 font-semibold rounded-lg mr-2"
            >
              Không
            </button>
            <button
              onClick={handleCancelOrder}
              className="w-1/2 py-2 bg-red-600 text-white font-semibold rounded-lg flex justify-center items-center"
            >
              {isLoadingUpdate ? <Loading /> : "Xác nhận "}
            </button>
          </div>
        </ModalContent>
      </SimpleModal>
      <RefundBankModal isOpen={showRefundModal} onClose={closeModal} order={selectedOrder} />
      <ReturnOrderModal isOpen={showReturnModal} onClose={closeModalReturn} order={selectedOrder} />
    </OrderItemListWrapper>
  );
};

export default OrderItemList;

OrderItemList.propTypes = {
  orders: PropTypes.array.isRequired, // Ensure orders is required and an array
};
