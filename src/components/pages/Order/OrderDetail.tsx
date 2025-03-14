import Breadcrumb from "@common/Breadcrum";
import Title from "@common/Title";
import UserMenu from "@components/atom/user/UserMenu";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllOrdersByUsers } from "@redux/slices/orderListSlice";
import { BaseBtnGreen, BaseButtonOuterspace, BaseButtonWhite, BaseButtonWhitesmoke } from "@styles/button";
import { Container } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { UserContent, UserDashboardWrapper } from "@styles/user";
import { currencyFormat } from "@ultils/helper";
import { get } from "http";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

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

const OrderDetailStatusWrapper = styled.div`
  margin: 0 36px;
  @media (max-width: ${breakpoints.sm}) {
    margin: 0 10px;
    overflow-x: scroll;
  }

  .order-status {
    height: 4px;
    margin: 60px 0;
    max-width: 580px;
    width: 500px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    margin-bottom: 70px;

    @media (max-width: ${breakpoints.sm}) {
      margin-right: 40px;
      margin-left: 40px;
    }

    &-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      &:nth-child(1) {
        left: 0;
      }

      &:nth-child(2) {
        left: calc(33.3333% - 10px);
      }

      &:nth-child(3) {
        left: calc(66.6666% - 10px);
      }
      &:nth-child(4) {
        right: 0;
      }

      &.status-done {
        background-color: ${defaultTheme.color_outerspace};
        .order-status-text {
          color: ${defaultTheme.color_outerspace};
        }
      }

      &.status-current {
        position: absolute;
        &::after {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: ${defaultTheme.color_outerspace};
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 30;
          border-radius: 50%;
        }

        .order-status-text {
          color: ${defaultTheme.color_outerspace};
        }
      }
    }

    &-text {
      position: absolute;
      top: calc(100% + 10px);
      left: 70%;
      transform: translateX(-50%);
    }
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

  /* Quà tặng */
  .gift-label {
    display: inline-block;
    background: #ff4d4f;
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
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
    color: #e11d48;
  }

  .order-summary .text-gray-500 {
    color: #6b7280;
  }

  .order-summary .font-bold {
    font-weight: bold;
  }
`;

const breadcrumbItems = [
  { label: "Home", link: "/" },
  { label: "Order", link: "/order" },
  { label: "Order Details", link: "/order_detail" },
];

const OrderDetailScreen = () => {
  const { orderId } = useParams();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.orderList.orders.find((o) => o.id === orderId));
  console.log("or", order);
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Không xác định"; // Giá trị mặc định nếu không có ngày hợp lệ

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Không hợp lệ"; // Kiểm tra nếu ngày không hợp lệ

    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <OrderDetailScreenWrapper className="page-py-spacing">
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
                    Tổng tiền: <span className="text-outerspace">{order?.totalPrice} </span>
                  </div>
                </div>
                <OrderDetailStatusWrapper className="order-d-status">
                  <div className="order-status bg-silver">
                    <div className="order-status-dot status-done bg-silver">
                      <span className="order-status-text font-semibold text-center no-wrap text-silver">
                        Đã đặt hàng
                      </span>
                    </div>
                    <div className="order-status-dot status-current bg-silver">
                      <span className="order-status-text font-semibold text-center no-wrap text-silver">
                        Đang xử lí
                      </span>
                    </div>
                    <div className="order-status-dot bg-silver">
                      <span className="order-status-text font-semibold text-center no-wrap text-silver">
                        Đang vận chuyển
                      </span>
                    </div>
                    <div className="order-status-dot bg-silver">
                      <span className="order-status-text font-semibold text-center no-wrap text-silver">
                        Đã vận chuyển
                      </span>
                    </div>
                  </div>
                </OrderDetailStatusWrapper>

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
                    <BaseButtonWhite className="request-button">Yêu Cầu Hóa Đơn Điện Tử</BaseButtonWhite>
                  </div>
                </OrderDetailMessageWrapper>
                {/*  list sp */}
                <OrderDetailListWrapper className="order-d-list">
                  {order?.orderDetails?.map((item, index) => (
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
                  ))}

                  {/* Thông tin tổng đơn hàng */}
                  <div className="order-summary">
                    <table className="w-full border-separate border-spacing-y-2">
                      <tbody>
                        <tr>
                          <td className="text-right text-gray-500">Tổng tiền hàng</td>
                          <td className="text-right">{currencyFormat(order?.totalPrice ?? 0)}</td>
                        </tr>
                        <tr>
                          <td className="text-right text-gray-500">Phí vận chuyển</td>
                          <td className="text-right">{currencyFormat(order?.shipCost ?? 0)}</td>
                        </tr>
                        <tr className="border-t border-gray-300">
                          <td className="text-right font-bold">Thành tiền</td>
                          <td className="text-right text-xl font-bold text-red-500">
                            {currencyFormat(order?.totalPrice ?? 0)}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-right text-gray-500">Phương thức Thanh toán</td>
                          <td className="text-right">{order?.payment?.paymentMethod}</td>
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
    </OrderDetailScreenWrapper>
  );
};

export default OrderDetailScreen;
