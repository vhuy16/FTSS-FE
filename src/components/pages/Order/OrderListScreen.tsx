import Breadcrumb from "@common/Breadcrum";
import Title from "@common/Title";
import UserMenu from "@atom/user/UserMenu";
import { Container } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { UserContent, UserDashboardWrapper } from "@styles/user";
import styled from "styled-components";
import OrderItemList from "./OrderItemList";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { useEffect, useState } from "react";
import { getAllOrdersByUsers } from "@redux/slices/orderListSlice";
import { getUserProfile } from "@redux/slices/userSlice";

type OrderStatus =
  | "pendingPayment"
  | "processing"
  | "pendingDelivery"
  | "delivered"
  | "paid"
  | "cancelled"
  | "refunded";

const OrderListScreenWrapper = styled.div`
  background-color: #f6f6f6;
  .order-tabs-contents {
    margin-top: 40px;
  }
  .order-tabs-head {
    min-width: 140px;
    padding: 12px 0;
    border-bottom: 3px solid ${defaultTheme.color_whitesmoke};

    &.order-tabs-head-active {
      border-bottom-color: ${defaultTheme.color_sea_green};
    }

    @media (max-width: ${breakpoints.lg}) {
      min-width: 120px;
    }
    @media (max-width: ${breakpoints.xs}) {
      min-width: 80px;
    }
  }
`;

const breadcrumbItems = [
  { label: "Home", link: "/" },
  { label: "Order", link: "/order" },
];

const OrderListScreen = () => {
  const dispatch = useAppDispatch();
  const orderData = useAppSelector((state) => state.orderList.orders) || [];

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getAllOrdersByUsers());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState<OrderStatus>("pendingPayment");
  const handleTabClick = (tab: OrderStatus) => setActiveTab(tab);

  const orderStatusMap: Record<OrderStatus, string> = {
    pendingPayment: "PENDING_PAYMENT",
    processing: "PROCESSING",
    pendingDelivery: "PENDING_DELIVERY",
    delivered: "DELIVERED",
    paid: "PAID",
    cancelled: "CANCELLED",
    refunded: "REFUNDED",
  };

  const filteredOrders = orderData.filter((order) => order.status === orderStatusMap[activeTab]);

  return (
    <OrderListScreenWrapper className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <Title titleText={"Đơn hàng"} />
            <div className="order-tabs mb-12">
              <div className="order-tabs-heads">
                {Object.keys(orderStatusMap).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`order-tabs-head text-xl italic ${activeTab === key ? "order-tabs-head-active" : ""}`}
                    onClick={() => handleTabClick(key as OrderStatus)}
                  >
                    {key === "pendingPayment" && "Chờ thanh toán"}
                    {key === "processing" && "Đang xử lí"}
                    {key === "pendingDelivery" && "Chờ giao hàng"}
                    {key === "delivered" && "Đã giao hàng"}
                    {key === "paid" && "Đã thanh toán"}
                    {key === "cancelled" && "Đã hủy"}
                    {key === "refunded" && "Trả hàng/Hoàn tiền"}
                  </button>
                ))}
              </div>

              <div className="order-tabs-contents">
                {filteredOrders.length > 0 ? (
                  <OrderItemList orders={filteredOrders} />
                ) : (
                  <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
                )}
              </div>
            </div>
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </OrderListScreenWrapper>
  );
};

export default OrderListScreen;
