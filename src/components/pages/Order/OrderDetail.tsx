import Breadcrumb from "@common/Breadcrum";
import Title from "@common/Title";
import Loading from "@components/atom/Loading/Loading";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import SimpleModal, { ModalContent, ModalHeader } from "@components/atom/modal/Modal";
import UserMenu from "@components/atom/user/UserMenu";
import { AssignmentTurnedIn, Cancel, CheckCircle, FeedOutlined, LocalShipping, StarBorder } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllOrdersByUsers, Order, OrderDetail } from "@redux/slices/orderListSlice";
import { getOrderById, updateOrder } from "@redux/slices/orderSlice";
import {
  BaseBtnGreen,
  BaseButtonGreen,
  BaseButtonOuterspace,
  BaseButtonWhite,
  BaseButtonWhitesmoke,
  BaseLinkRed,
} from "@styles/button";
import { Container } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { UserContent, UserDashboardWrapper } from "@styles/user";
import { currencyFormat } from "@ultils/helper";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
type OrderStatus = "PROCESSING" | "PENDING_DELIVERY" | "PROCESSED" | "COMPLETED";
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
const statusSteps: OrderStatus[] = ["PROCESSING", "PROCESSED", "PENDING_DELIVERY", "COMPLETED"];
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
    max-width: 740px;
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

const OrderDetailStatusWrapperv2 = styled.div`
  .refund-status-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 100px 0;
  }

  .refund-status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 500px; /* Độ dài thanh ngang */
    position: relative;
  }

  .status-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .status-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: gray;
    position: relative;
    z-index: 1;
  }

  .status-line {
    position: absolute;
    top: 8px;
    left: 50%;
    width: 420px; /* Chiều dài thanh nối */
    height: 2px;
    background-color: gray;
    z-index: 0;
  }

  .status-label {
    margin-top: 5px;
    font-size: 12px;
    color: #666;
  }
`;

const OrderDetailMessageWrapper = styled.div`
  background-color: ${defaultTheme.color_green_v1};
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
  &::after {
    content: "";
    position: absolute;
    top: -14px;
    left: 20%;
    border-bottom: 14px solid ${defaultTheme.color_green_v1};
    border-top: 14px solid transparent;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
  }

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

  /* Tạo mũi tên chỉ xuống */
  &::after {
    content: "";
    position: absolute;
    top: -14px;
    left: 20%;
    border-bottom: 14px solid ${defaultTheme.color_green_v1};
    border-top: 14px solid transparent;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
  }

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
  const [order, setOrder] = useState<Order | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!orderId) return;

    (async () => {
      try {
        const res = await dispatch(getOrderById(orderId));
        setOrder(res.payload as Order);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    })();
  }, [dispatch, orderId]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Không xác định"; // Giá trị mặc định nếu không có ngày hợp lệ

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Không hợp lệ"; // Kiểm tra nếu ngày không hợp lệ

    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const orderStatusMap: Record<OrderStatus, string> = {
    PROCESSING: "PROCESSING",
    PENDING_DELIVERY: "PENDING_DELIVERY",
    COMPLETED: "COMPLETED",
    PROCESSED: "PROCESSED",
  };

  const statusIcons: Record<OrderStatus, JSX.Element> = {
    PROCESSING: <FeedOutlined className="status-icon" />,
    PROCESSED: <AssignmentTurnedIn className="status-icon" />,
    PENDING_DELIVERY: <LocalShipping className="status-icon" />,
    COMPLETED: <CheckCircle className="status-icon" />,
  };
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const openModalDelete = () => {
    setIsModalOpenDelete(true);
  };
  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };
  const isLoading = useAppSelector((state) => state.order.isLoading);
  const isLoadingUpdate = useAppSelector((state) => state.order.isLoadingUpdate);

  const handleCancelOrder = async () => {
    try {
      await dispatch(updateOrder({ id: orderId ?? "", status: "CANCELLED" }));
      toast.success("Đơn hàng đã được hủy!");

      const res = await dispatch(getOrderById(orderId ?? ""));
      setOrder(res.payload as Order);

      setIsModalOpenDelete(false);
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại!");
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };
  return (
    <OrderDetailScreenWrapper className="page-py-spacing">
      {isLoading ? (
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
                      <h4 className="text-3xl order-d-no">Mã đặt hàng: {order?.id}</h4>
                      <p className="text-lg font-medium text-gray">{formatDate(order?.createDate)}</p>
                      <p className="text-lg font-medium text-gray">Địa chỉ: {order?.address}</p>
                    </div>
                    <div className="order-d-top-r text-xxl text-gray font-semibold">
                      <h4 className="text-3xl mb-7"> {order?.status}</h4>
                    </div>
                  </div>
                  {/* status orderorder */}
                  {["PROCESSING", "PENDING_DELIVERY", "PROCESSED", "COMPLETED"].includes(order?.status || "") ? (
                    <OrderDetailStatusWrapper
                      currentIndex={statusSteps.indexOf(order?.status as OrderStatus)}
                      totalSteps={statusSteps.length}
                    >
                      <div className="order-status">
                        {statusSteps.map((status, index) => {
                          const currentIndex = statusSteps.indexOf(order?.status as OrderStatus);
                          const isDone = index < currentIndex;
                          const isCurrent = index === currentIndex;
                          const isPending = index > currentIndex;

                          return (
                            <div className="order-status-1">
                              <div
                                key={status}
                                className={`order-status-dot 
            ${isCurrent ? "status-current" : ""} 
            ${isDone ? "status-done" : ""} 
            ${isPending ? "status-pending" : ""}`}
                              >
                                {statusIcons[status]}
                                <span className="status-text">{orderStatusMap[status]}</span> {/* Thêm chữ */}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </OrderDetailStatusWrapper>
                  ) : (
                    <OrderDetailStatusWrapperv2>
                      <div className="refund-status-container">
                        <div className="refund-status-bar">
                          <div className="status-step">
                            <div className="status-dot"></div>
                            <div className="status-line"></div>
                            <span className="status-label">Gửi yêu cầu</span>
                          </div>

                          <div className="status-step">
                            <div className="status-dot"></div>
                            <span className="status-label">Được chấp nhận</span>
                          </div>
                        </div>
                      </div>
                    </OrderDetailStatusWrapperv2>
                  )}
                  {order?.status === "COMPLETED" ? (
                    <OrderDetailMessageWrapper>
                      <div className="order-message-content">
                        <p className="font-semibold">
                          Hãy kiểm tra cẩn thận tất cả các sản phẩm trong đơn hàng trước khi bấm "Đã nhận được hàng".
                        </p>
                        <p className="text-gray-600">{formatDate(order?.createDate)}.</p>
                      </div>

                      <div className="order-buttons">
                        <BaseBtnGreen className="confirm-button">Đã Nhận Hàng</BaseBtnGreen>
                        <BaseButtonWhite className="request-button">Yêu Cầu Trả Hàng/Hoàn Tiền</BaseButtonWhite>
                      </div>
                    </OrderDetailMessageWrapper>
                  ) : ["PROCESSING"].includes(order?.status || "") ? (
                    <OrderDetailMessageWrapperv2>
                      <div className="order-message-content">
                        <p className="font-semibold">Đơn hàng của bạn sẽ được chuẩn bị và chuyển đi</p>
                        <p className="text-gray-600">{formatDate(order?.createDate)}.</p>
                      </div>

                      <div className="order-buttons">
                        <BaseButtonWhite className="request-button">Liên hệ người bán</BaseButtonWhite>
                        <BaseButtonWhite className="request-button" onClick={openModalDelete}>
                          Hủy đơn hàng
                        </BaseButtonWhite>
                      </div>
                    </OrderDetailMessageWrapperv2>
                  ) : null}

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
                            <p className="text-red-500 font-bold">{currencyFormat(item.price)}</p>
                          </div>
                        </div>
                        {/* Thông tin tổng đơn hàng */}
                      </>
                    ))}
                    <div className="order-summary">
                      <table className="w-full border-separate border-spacing-y-2">
                        <tbody>
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
                          <tr>
                            <td className="text-right text-gray-500">Phương thức Thanh toán</td>
                            <td className="text-right text-xl">{order?.payment?.paymentMethod}</td>
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
            <button onClick={handleCancelOrder} className="w-1/2 py-2 bg-red-600 text-white font-semibold rounded-lg">
              {isLoadingUpdate ? <Loading /> : "Xác nhận "}
            </button>
          </div>
        </ModalContent>
      </SimpleModal>
    </OrderDetailScreenWrapper>
  );
};

export default OrderDetailScreen;
