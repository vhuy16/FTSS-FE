import Breadcrumb from "@common/Breadcrum";
import Title from "@common/Title";
import ChatboxWidget from "@components/atom/ChatWidget/ChatWidget";
import Loading from "@components/atom/Loading/Loading";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import { ConfirmModal } from "@components/atom/modal/ConfirmModal";
import SimpleModal, { ModalContent, ModalHeader } from "@components/atom/modal/Modal";
import { RefundBankModal } from "@components/atom/modal/RefundBankModal";
import UserMenu from "@components/atom/user/UserMenu";
import { AssignmentTurnedIn, CheckCircle, FeedOutlined, LocalShipping } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { Order, OrderDetail } from "@redux/slices/orderListSlice";
import { getOrderById, updateOrder } from "@redux/slices/orderSlice";
import { getUserProfile } from "@redux/slices/userSlice";
import { BaseBtnGreen, BaseButtonOuterspace, BaseButtonWhite } from "@styles/button";
import { Container } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { UserContent, UserDashboardWrapper } from "@styles/user";
import { currencyFormat, formatDate } from "@ultils/helper";
import { useCallback, useEffect, useState } from "react";
import { FaBoxOpen, FaCheck, FaClock, FaRegMoneyBillAlt, FaTimes, FaTruck } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
type OrderStatus =
  | "PROCESSING"
  | "PENDING_DELIVERY"
  | "PROCESSED"
  | "COMPLETED"
  | "CANCELLED"
  | "RETURNING"
  | "RETURNED"
  | "DONE"
  | "NOTDONE";
const OrderDetailScreenWrapper = styled.main`
  .btn-and-title-wrapper {
    margin-bottom: 24px;
    .title {
      margin-bottom: 0;
    }

    .btn-go-back {
      margin-right: 12px;
      transition: ${defaultTheme.default_transition};

      &:hover {
        margin-right: 16px;
      }
    }
  }

  .order-d-top {
    background-color: ${defaultTheme.color_whitesmoke};
    padding: 26px 32px;
    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.05);

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
      row-gap: 12px;
    }
  }
`;
const OrderDetailContainer = styled.div`
  background-color: white;
  padding: 40px;
  box-shadow: 2px 2px 5px 5px rgba(0, 0, 0, 0.03); /* Tạo hiệu ứng tách biệt */
`;
const statusSteps: OrderStatus[] = ["PROCESSING", "PROCESSED", "PENDING_DELIVERY", "DONE", "COMPLETED"];
const OrderDetailStatusWrapper = styled.div<{ currentIndex: number; totalSteps: number }>`
  margin: 0 40px;

  @media (max-width: ${breakpoints.sm}) {
    margin: 0 10px;
    overflow-x: auto;
  }

  .order-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 900px;
    width: 100%;
    margin: 100px auto 90px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(
        to right,
        #4caf50 ${({ currentIndex, totalSteps }) => (currentIndex / (totalSteps - 1)) * 100}%,
        #ddd ${({ currentIndex, totalSteps }) => (currentIndex / (totalSteps - 1)) * 100}%
      );
      z-index: 0;
      transform: translateY(-50%);
      transition: background 0.3s ease-in-out;
    }

    &-dot {
      position: relative;
      z-index: 1;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border: 3px solid #4caf50;
      background-color: #fff;
      transition: all 0.3s ease-in-out;

      .status-icon {
        font-size: 40px;
        color: #4caf50;
      }

      .status-text {
        margin-top: 15px; /* Khoảng cách chữ với dot */
        font-size: 18px;
        color: #4caf50;
        text-align: center;
        position: absolute;
        bottom: -40px; /* Dịch xuống dưới */
        left: 50%;
        transform: translateX(-50%);
        display: inline-block;
        white-space: nowrap;
      }

      &.status-current {
        background-color: #4caf50;
        border: 3px solid #4caf50;
        .status-icon {
          color: #fff;
        }
      }

      &.status-done {
        background-color: white;
        border: 3px solid #4caf50;
        .status-icon {
          color: #4caf50;
        }
      }

      &.status-pending {
        border: 3px solid #ddd;
        background-color: #f5f5f5;
        .status-icon {
          color: #bbb;
        }
        .status-text {
          color: #bbb;
        }
      }
    }
  }
`;

const OrderDetailMessageWrapper = styled.div`
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

const OrderDetailMessageWrapperv2 = styled.div`
  background-color: #fffcf5;
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
    border: 0.5px solid ${defaultTheme.color_gray};
  }

  .request-button {
    border: 1px solid ${defaultTheme.color_gray};
    color: black;
    background-color: white;
  }
`;
const OrderDetailListWrapper = styled.div`
  padding: 24px;
  margin-top: 40px;
  border: 2px solid rgba(0, 0, 0, 0.05);
  background: #fff;
  border-radius: 8px;

  .order-d-item {
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid ${defaultTheme.color_whitesmoke};
    align-items: center;

    @media (max-width: ${breakpoints.sm}) {
      grid-template-columns: 60px 1fr;
      gap: 12px;
    }

    &-img {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

      @media (max-width: ${breakpoints.sm}) {
        width: 60px;
        height: 60px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .product-name {
        font-size: 1rem;
        font-weight: bold;
      }

      .variant {
        font-size: 0.875rem;
        color: #666;
      }

      .quantity {
        font-size: 0.875rem;
        color: #666;
      }
    }

    &-price {
      text-align: right;
      min-width: 100px;

      p {
        margin: 0;
      }

      .line-through {
        text-decoration: line-through;
        color: gray;
      }

      .text-red-500 {
        font-size: 1.2rem;
        font-weight: bold;
        color: red;
      }
    }
  }

  /* Phần tổng kết */
  .order-summary {
    width: 100%;
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

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đơn hàng", link: "/order" },
  { label: "Thông tin đơn hàng", link: "/order_detail" },
];

const OrderDetailScreen = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const isLoading = useAppSelector((state) => state.order.isLoading);
  const isLoadingUpdate = useAppSelector((state) => state.order.isLoadingUpdate);
  const isLoadingProfile = useAppSelector((state) => state.userProfile.isLoading);
  const order = useAppSelector((state) => state.order.order);
  // const [order, setOrder] = useState<Order | null>(null);
  const total = order?.orderDetails.reduce((total: number, item: OrderDetail) => {
    return total + item.price * item.quantity;
  }, 0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderReport, setSelectedOrderReport] = useState<Order | null>(null);
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   if (!orderId) return;

  //   (async () => {
  //     try {
  //       const res = await dispatch(getOrderById(orderId));
  //       setOrder(res.payload as Order);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy đơn hàng:", error);
  //     }
  //   })();
  // }, [dispatch, orderId]);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getOrderById(orderId as string));
  }, [dispatch, orderId]);

  const orderStatusMap: Record<OrderStatus, string> = {
    PROCESSING: "Đang xử lý",
    PENDING_DELIVERY: "Đang giao hàng",
    COMPLETED: "Hoàn thành",
    PROCESSED: "Đã xử lý",
    CANCELLED: "Đã hủy",
    RETURNING: "Xử lý yêu cầu trả hàng",
    RETURNED: "Trả hàng",
    DONE: "Hoàn thành lắp đặt",
    NOTDONE: "Chưa hoàn thành lắp đặt",
  };

  const statusIcons: Record<OrderStatus, JSX.Element> = {
    PROCESSING: <FeedOutlined className="status-icon" />,
    PROCESSED: <AssignmentTurnedIn className="status-icon" />,
    PENDING_DELIVERY: <LocalShipping className="status-icon" />,
    COMPLETED: <CheckCircle className="status-icon" />,
    RETURNING: <FeedOutlined className="status-icon" />,
    RETURNED: <CheckCircle className="status-icon" />,
    CANCELLED: <LocalShipping className="status-icon" />,
    DONE: <CheckCircle className="status-icon" />,
    NOTDONE: <LocalShipping className="status-icon" />,
  };
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const openModalDelete = () => {
    setIsModalOpenDelete(true);
  };
  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  const handleCancelOrder = async () => {
    try {
      const res = await dispatch(updateOrder({ id: orderId ?? "", status: "CANCELLED" }));
      const data = res.payload;

      // setOrder(res.payload as Order);
      if (res.meta.requestStatus === "fulfilled" && (data?.status === "200" || data?.status === "201")) {
        toast.success("Đơn hàng đã được hủy!");
        setIsModalOpenDelete(false);
        await dispatch(getOrderById(orderId ?? ""));
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
  // confirm
  const openModalConfirm = (order: Order) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };
  const closeModalConfirm = useCallback(() => {
    setShowConfirmModal(false);
    setSelectedOrder(null);
  }, []);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  //chat

  const openChatboxWithOrder = (order: Order) => {
    setShowChatModal(true); // Mở chatbox
    setSelectedOrderReport(order); // Truyền Order vào chatbox
    // setHasNotification(false); // Tắt notification khi mở chat
  };
  const closeModalChat = () => setShowChatModal(false);
  const [showChatModal, setShowChatModal] = useState(false);
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
  return (
    <OrderDetailScreenWrapper className="page-py-spacing">
      {isLoading && isLoadingProfile ? (
        <LoadingPage />
      ) : (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <UserDashboardWrapper>
            <UserMenu />
            <UserContent>
              <OrderDetailContainer>
                <div className="flex items-center justify-start btn-and-title-wrapper">
                  <Link to="/order" className="btn-go-back inline-flex items-center justify-center text-xxl">
                    <i className="bi bi-chevron-left"></i>
                  </Link>
                  <Title titleText={"Thông tin đơn hàng"} />
                </div>
                <div className="order-d-wrapper">
                  <div className="order-d-top flex justify-between items-start">
                    <div className="order-d-top-l">
                      <h4 className="text-3xl order-d-no">
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">Mã đặt hàng:</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-500 ">
                            {order?.oderCode}
                          </span>
                        </div>
                      </h4>
                      <p className="text-lg font-medium text-gray">
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">Ngày tạo:</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                            {formatDate(order?.createDate || "")}
                          </span>
                        </div>
                      </p>
                      {order?.setupPackage ? (
                        <p className="text-lg font-medium text-gray">
                          <div className="flex items-center">
                            <span className="text-gray-800 font-bold mr-2">Ngày lắp đặt:</span>
                            <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                              {formatDate(order?.installationDate || "")}
                            </span>
                          </div>
                        </p>
                      ) : (
                        <></>
                      )}
                      <p className="text-lg font-medium text-gray">
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">Người nhận:</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                            {order?.buyerName}
                          </span>
                        </div>
                      </p>
                      <p className="text-lg font-medium text-gray">
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">Địa chỉ:</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                            {order?.address}
                          </span>
                        </div>
                      </p>
                      <p className="text-lg font-medium text-gray">
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">SĐT:</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                            {order?.phoneNumber}
                          </span>
                        </div>
                      </p>
                      <p className="text-lg font-medium text-gray mb-3">
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">Trạng thái đơn hàng:</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                            <StatusTag status={order?.status ?? "UNKNOWN"} />
                          </span>
                        </div>
                      </p>
                      <p className="text-lg font-medium text-gray">
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">Trạng thái thanh toán</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                            <PaymentStatus status={order?.payment?.paymentStatus ?? "UNKNOWN"} />
                          </span>
                        </div>
                      </p>
                      <p className="text-lg font-medium text-gray">
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">Phương thức thanh toán:</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                            {order?.payment?.paymentMethod === "COD"
                              ? "Thanh toán khi nhận hàng"
                              : order?.payment?.paymentMethod}
                          </span>
                        </div>
                      </p>
                    </div>
                    <div className="order-d-top-r text-xxl text-gray font-semibold">
                      <h4
                        className={`text-3xl mb-7 ${
                          order?.status === "CANCELLED"
                            ? "text-red"
                            : order?.status === "RETURNED"
                            ? "text-yellow"
                            : order?.status === "RETURNING"
                            ? "text-gray-600"
                            : "text-green"
                        }`}
                      >
                        {order?.status === "PROCESSING" && "Đang xử lý"}
                        {order?.status === "PROCESSED" && "Đã xử lý"}
                        {order?.status === "PENDING_DELIVERY" && "Chờ giao hàng"}
                        {order?.status === "COMPLETED" && "Hoàn thành"}
                        {order?.status === "CANCELLED" && "Đã hủy"}
                        {order?.status === "RETURNED" && "Trả hàng"}
                        {order?.status === "RETURNING" && "Xử lý yêu cầu trả hàng"}
                      </h4>
                    </div>
                  </div>
                  {/* status orderorder */}
                  {order?.status === "CANCELLED" ? (
                    <div className="mt-4"></div>
                  ) : (order?.status === "RETURNING" || order?.status === "RETURNED") && order?.returnRequests?.[0] ? (
                    <div className="return-detail-wrapper mt-4">
                      {/* Thông tin hoàn trả */}
                      <div className="return-info mb-4">
                        <h3 className="text-2xl font-bold mb-2">Chi tiết hoàn trả</h3>
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">Lý do:</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                            {order.returnRequests[0].reason || "Không có lý do cụ thể"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-800 font-bold mr-2">Thời gian yêu cầu:</span>
                          <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                            {formatDate(order.returnRequests[0].createdAt || "N/A")}
                          </span>
                        </div>
                      </div>

                      {/* Hình ảnh / video */}
                      <div className="return-media">
                        <h4 className="text-xl font-bold mb-3">Hình ảnh / Video</h4>
                        <div className="flex gap-4 flex-wrap">
                          {order.returnRequests[0].mediaFiles?.length > 0 ? (
                            order.returnRequests[0].mediaFiles.map((file, idx) =>
                              file.mediaType === "VIDEO" ? (
                                <video key={idx} controls className="w-48 h-32 rounded shadow">
                                  <source src={file.mediaLink} type="video/mp4" />
                                </video>
                              ) : (
                                <img
                                  key={idx}
                                  src={file.mediaLink}
                                  alt={`media-${idx}`}
                                  className="w-48 h-32 object-cover rounded shadow"
                                />
                              )
                            )
                          ) : (
                            <p>Không có hình ảnh hoặc video.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : ["PROCESSING", "PENDING_DELIVERY", "PROCESSED", "COMPLETED"].includes(order?.status || "") &&
                    order?.setupPackage == null ? (
                    <OrderDetailStatusWrapper
                      currentIndex={statusSteps.indexOf(order?.status as OrderStatus)}
                      totalSteps={statusSteps.length}
                    >
                      <div className="order-status">
                        {statusSteps
                          .filter((s) => {
                            if (!order?.setupPackage) {
                              return s != "DONE";
                            } else {
                              return true;
                            }
                          })
                          .map((status, index) => {
                            const currentIndex = statusSteps.indexOf(order?.status as OrderStatus);
                            const isDone = index < currentIndex;
                            const isCurrent = index === currentIndex;
                            const isPending = index > currentIndex;

                            return (
                              <div className="order-status-1" key={status}>
                                <div
                                  className={`order-status-dot 
                ${isCurrent ? "status-current" : ""} 
                ${isDone ? "status-done" : ""} 
                ${isPending ? "status-pending" : ""}`}
                                >
                                  {statusIcons[status]}
                                  <span className="status-text">{orderStatusMap[status]}</span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </OrderDetailStatusWrapper>
                  ) : ["PROCESSING", "PENDING_DELIVERY", "PROCESSED", "DONE", "COMPLETED"].includes(
                      order?.status || ""
                    ) && order?.setupPackage ? (
                    <OrderDetailStatusWrapper
                      currentIndex={statusSteps.indexOf(order?.status as OrderStatus)}
                      totalSteps={statusSteps.length}
                    >
                      <div className="order-status">
                        {statusSteps
                          .filter((s) => {
                            if (!order?.setupPackage) {
                              return s != "DONE";
                            } else {
                              return true;
                            }
                          })
                          .map((status, index) => {
                            const currentIndex = statusSteps.indexOf(order?.status as OrderStatus);
                            const isDone = index < currentIndex;
                            const isCurrent = index === currentIndex;
                            const isPending = index > currentIndex;

                            return (
                              <div className="order-status-1" key={status}>
                                <div
                                  className={`order-status-dot 
                ${isCurrent ? "status-current" : ""} 
                ${isDone ? "status-done" : ""} 
                ${isPending ? "status-pending" : ""}`}
                                >
                                  {statusIcons[status]}
                                  <span className="status-text">{orderStatusMap[status]}</span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </OrderDetailStatusWrapper>
                  ) : (
                    <div className="mt-4"></div>
                  )}

                  {order?.status === "DONE" && order?.setupPackage ? (
                    <OrderDetailMessageWrapper>
                      <div className="order-message-content">
                        <p className="font-semibold">"Hãy kiểm tra cẩn thận tất cả các sản phẩm trong đơn hàng "</p>
                        <p className="font-semibold">"Đơn hàng của bạn đã được giao"</p>
                        <p className="text-gray-600">{formatDate(order?.modifyDate || "")}.</p>
                      </div>
                      <div className="order-buttons">
                        <BaseBtnGreen
                          className="confirm-button"
                          onClick={() => openModalConfirm(order as unknown as Order)}
                        >
                          Đã hoàn thành lắp đặt
                        </BaseBtnGreen>
                        <BaseButtonOuterspace
                          className="confirm-button"
                          onClick={() => openChatboxWithOrder(order as unknown as Order)}
                        >
                          Báo cáo/Khiếu nại
                        </BaseButtonOuterspace>
                      </div>
                    </OrderDetailMessageWrapper>
                  ) : ["PROCESSING"].includes(order?.status || "") && order?.setupPackage == null ? (
                    <OrderDetailMessageWrapperv2>
                      <div className="order-message-content">
                        <p className="font-semibold">Đơn hàng của bạn sẽ được chuẩn bị và chuyển đi</p>
                        <p className="text-gray-600">{formatDate(order?.modifyDate || "")}.</p>
                      </div>

                      <div className="order-buttons">
                        <BaseButtonWhite className="request-button" onClick={openModalDelete}>
                          Hủy đơn hàng
                        </BaseButtonWhite>
                      </div>
                    </OrderDetailMessageWrapperv2>
                  ) : null}
                  {["COMPLETED"].includes(order?.status || "") && (
                    <OrderDetailMessageWrapper>
                      <div className="order-message-content">
                        <p className="font-semibold">Hãy kiểm tra cẩn thận tất cả các sản phẩm trong đơn hàng</p>
                        <p className="font-semibold">Đơn hàng của bạn đã được giao</p>
                        <p className="text-gray-600">{formatDate(order?.modifyDate || "")}.</p>
                      </div>
                      <div className="order-buttons">
                        <BaseButtonOuterspace
                          className="confirm-button"
                          onClick={() => openChatboxWithOrder(order as Order)}
                        >
                          Báo cáo/Khiếu nại
                        </BaseButtonOuterspace>
                      </div>
                    </OrderDetailMessageWrapper>
                  )}
                  {order?.status === "PROCESSING" && order?.setupPackage && (
                    <OrderDetailMessageWrapperv2>
                      <div className="order-message-content">
                        <p className="font-semibold">Đơn hàng của bạn sẽ được chuẩn bị và lắp đặt </p>
                        <p className="text-gray-600">{formatDate(order?.installationDate || "")}.</p>
                      </div>
                      <div className="order-buttons">
                        <BaseButtonWhite className="request-button" onClick={openModalDelete}>
                          Hủy đơn hàng
                        </BaseButtonWhite>
                      </div>
                    </OrderDetailMessageWrapperv2>
                  )}
                  {/* hoan tientien */}
                  {order?.status === "CANCELLED" && order?.payment?.paymentStatus === "Completed" && (
                    <OrderDetailMessageWrapper>
                      <div className="order-message-content">
                        <p className="font-semibold">"Vui lòng nhấn yêu cầu hoàn tiền để gửi thông tin hoàn tiền".</p>
                      </div>
                      <div className="order-buttons">
                        <BaseButtonWhite
                          className="request-button"
                          onClick={() => openModal(order as unknown as Order)}
                        >
                          Yêu Cầu Hoàn Tiền
                        </BaseButtonWhite>
                      </div>
                    </OrderDetailMessageWrapper>
                  )}
                  {/*  list sp */}
                  <OrderDetailListWrapper className="order-d-list">
                    {order?.orderDetails?.map((item, index) => (
                      <>
                        <div className="order-d-item grid">
                          {/* Hình ảnh sản phẩm */}
                          <div className="order-d-item-img">
                            <img src={item.linkImage} alt={item.productName} className="object-fit-cover" />
                          </div>

                          {/* Thông tin sản phẩm */}
                          <div className="order-d-item-info">
                            <p className="text-xl font-bold">{item.productName}</p>
                            <p className="text-gray">x{item.quantity}</p>
                          </div>

                          {/* Giá sản phẩm */}
                          <div className="order-d-item-price">
                            <p className="text-gray-500 ">{currencyFormat(item.price)}</p>
                          </div>
                        </div>
                        {/* Thông tin tổng đơn hàng */}
                      </>
                    ))}
                    <div className="order-summary">
                      <table className="w-full border-separate border-spacing-y-2">
                        <tbody>
                          <tr>
                            <td className="text-right text-gray-500">Tổng phụ</td>
                            <td className="text-right">{currencyFormat(total ?? 0)}</td>
                          </tr>
                          <tr>
                            <td className="text-right text-gray-500">Giảm giá</td>
                            <td className="text-right">
                              -{currencyFormat((total ?? 0) + (order?.shipCost ?? 0) - (order?.totalPrice ?? 0))}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-right text-gray-500">Phí vận chuyển</td>
                            <td className="text-right">{currencyFormat(order?.shipCost ?? 0)}</td>
                          </tr>
                          <tr className="border-t border-gray-300">
                            <td className="text-right font-bold">Thành tiền</td>
                            <td className="text-right text-4xl font-bold text-red-500">
                              {currencyFormat(order?.totalPrice ?? 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </OrderDetailListWrapper>
                </div>
              </OrderDetailContainer>
            </UserContent>
          </UserDashboardWrapper>
        </Container>
      )}
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
      <ConfirmModal isOpen={showConfirmModal} onClose={closeModalConfirm} order={selectedOrder} />
      <RefundBankModal isOpen={showRefundModal} onClose={closeModal} order={selectedOrder} />
      <ChatboxWidget
        isOpen={showChatModal}
        onClose={closeModalChat}
        order={selectedOrderReport}
        setIsOpen={setShowChatModal}
      />
    </OrderDetailScreenWrapper>
  );
};

export default OrderDetailScreen;
