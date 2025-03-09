import PropTypes from "prop-types";
import OrderItem from "./OrderItem";
import { Order } from "@redux/slices/orderListSlice";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import styled from "styled-components";
import { BaseBtnGreen, BaseLinkOutlineGreen } from "@styles/button";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@ultils/helper";

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
`;
const OrderItemList: React.FC<OrderItemListProps> = ({ orders }) => {
  const navigate = useNavigate();
  console.log("or", orders);
  return (
    <OrderItemListWrapper>
      {orders?.map((order) => (
        <div className="order-items" key={order.id}>
          {/* Hiển thị thông tin đơn hàng */}
          <div className="order-item-details">
            <div className="flex justify-between items-center pb-5">
              <h3 className="text-gray-800 order-item-title font-bold">Mã đặt hàng: {order.id}</h3>
              <BaseBtnGreen onClick={() => navigate(`/order-detail/${order.id}`)}>Xem chi tiết</BaseBtnGreen>
            </div>
            <div className="order-info-group flex flex-wrap">
              <div className="order-info-item">
                <span className="text-gray font-semibold">Ngày đặt hàng:</span>
                <span className="text-silver font-semibold">{formatDate(order.createDate)}</span>
              </div>
              <div className="order-info-item">
                <span className="text-gray font-semibold">Trạng thái:</span>
                <span className="text-silver font-semibold">
                  {order.status === "PENDING"
                    ? "Chờ thanh toán"
                    : order.status === "PROCESSING"
                    ? "Đang xử lý"
                    : order.status === "CANCELLED"
                    ? "Đã hủy"
                    : order.status === "PAID"
                    ? "Đã thanh toán"
                    : order.status}
                </span>
              </div>
              <div className="order-info-item">
                <span className="text-gray font-semibold">Địa chỉ:</span>
                <span className="text-silver font-semibold">{order.address}</span>
              </div>
              <div className="order-info-item">
                <span className="text-gray font-semibold">Phương thức thanh toán:</span>
                <span className="text-silver font-semibold">{order.payment.paymentMethod}</span>
              </div>
            </div>
          </div>
          {/* Hiển thị danh sách sản phẩm của đơn hàng */}
          {order.orderDetails?.map((item, index) => (
            <OrderItem key={`${order.id}-${index}`} order={order} item={item} />
          ))}
        </div>
      ))}
    </OrderItemListWrapper>
  );
};

export default OrderItemList;

OrderItemList.propTypes = {
  orders: PropTypes.array.isRequired, // Ensure orders is required and an array
};
