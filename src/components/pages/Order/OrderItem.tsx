import styled from "styled-components";
import PropTypes from "prop-types";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { currencyFormat } from "@ultils/helper";
import { BaseBtnGreen } from "@styles/button";
import { type } from "@testing-library/user-event/dist/type";
import { Order } from "@redux/slices/orderListSlice";
import { useNavigate } from "react-router-dom";

interface OrderItemProps {
  order: Order;
}
const OrderDetailListWrapper = styled.div`
  padding: 24px;
  margin-top: 15px;
  border: 2px solid rgba(0, 0, 0, 0.07);

  @media (max-width: ${breakpoints.md}) {
    padding: 18px;
  }

  @media (max-width: ${breakpoints.md}) {
    padding: 12px;
  }

  .order-d-item {
    grid-template-columns: 80px 1fr 1fr 32px;
    gap: 20px;
    padding: 12px 0;
    border-bottom: 1px solid ${defaultTheme.color_whitesmoke};
    position: relative;

    @media (max-width: ${breakpoints.xl}) {
      grid-template-columns: 80px 3fr 2fr 32px;
      padding: 16px 0;
      gap: 16px;
    }

    @media (max-width: ${breakpoints.sm}) {
      grid-template-columns: 50px 3fr 2fr;
      gap: 16px;
    }

    @media (max-width: ${breakpoints.xs}) {
      grid-template-columns: 100%;
      gap: 12px;
    }

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    &-img {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

      @media (max-width: ${breakpoints.sm}) {
        width: 50px;
        height: 50px;
      }

      @media (max-width: ${breakpoints.sm}) {
        width: 100%;
        height: 100%;
      }
    }

    &-calc {
      p {
        display: inline-block;
        margin-right: 50px;

        @media (max-width: ${breakpoints.lg}) {
          margin-right: 20px;
        }
      }
    }

    &-btn {
      margin-bottom: auto;
      &:hover {
        color: ${defaultTheme.color_sea_green};
      }

      @media (max-width: ${breakpoints.sm}) {
        position: absolute;
        right: 0;
        top: 10px;
      }

      @media (max-width: ${breakpoints.xs}) {
        width: 28px;
        height: 28px;
        z-index: 5;
        background-color: ${defaultTheme.color_white};
        border-radius: 50%;
        right: 8px;
        top: 24px;
      }
    }
  }
`;

interface OrderDetail {
  productName: string;
  price: number;
  quantity: number;
  linkImage: string;
}

interface OrderItemProps {
  order: Order;
  item: OrderDetail;
}
const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  console.log("eee", item);
  const navigate = useNavigate();
  return (
    <OrderDetailListWrapper className="order-d-list">
      <div className="order-d-item grid">
        <div className="order-d-item-img">
          <img src={item.linkImage} alt="" className="object-fit-cover" />
        </div>
        <div className="order-d-item-info">
          <p className="text-xl font-bold">{item.productName}</p>
        </div>
        <div className="order-d-item-calc">
          <p className="font-bold text-lg">
            Số lượng: &nbsp;
            <span className="text-gray">{item.quantity}</span>
          </p>
          <p className="font-bold text-lg">
            Giá: &nbsp;
            <span className="text-gray">{currencyFormat(item.price)}</span>
          </p>
        </div>
      </div>
    </OrderDetailListWrapper>
  );
};

export default OrderItem;
