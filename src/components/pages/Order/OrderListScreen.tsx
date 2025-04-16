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
import LoadingPage from "@components/atom/Loading/LoadingPage";

type OrderStatus = "ALL" | "PROCESSING" | "PENDING_DELIVERY" | "PROCESSED" | "COMPLETED" | "CANCELLED" | "RETURN";

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
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đơn hàng", link: "/order" },
];

const OrderListScreen = () => {
  const dispatch = useAppDispatch();
  const orderData = useAppSelector((state) => state.orderList.orders) || [];
  const ordersWithSetup = orderData.filter((or) => or.setupPackage !== null);
  const ordersWithProduct = orderData.filter((or) => or.setupPackage == null);
  const isLoading = useAppSelector((state) => state.orderList.loading);
  const [activeTab, setActiveTab] = useState<OrderStatus>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<"PRODUCT" | "FISH_TANK">("PRODUCT");
  const isLoadingProfile = useAppSelector((state) => state.userProfile.isLoading);

  //search
  const [searchValue, setSearchValue] = useState("");

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as "PRODUCT" | "FISH_TANK");
  };
  useEffect(() => {
    dispatch(getUserProfile());
  }, []);
  useEffect(() => {
    if (activeTab === "ALL") {
      dispatch(getAllOrdersByUsers()); // tải tất cả đơn hàng
    } else if (activeTab === "RETURN") {
      dispatch(getAllOrdersByUsers()); // tải tất cả rồi lọc client
    } else {
      dispatch(getAllOrdersByUsers(activeTab)); // truyền status đơn
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (activeTab === "ALL" && searchValue.trim() === "") {
      dispatch(getAllOrdersByUsers());
    }
  }, [searchValue, activeTab, dispatch]);

  const handleTabClick = (tab: OrderStatus) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };
  const filteredOrders = (() => {
    const baseOrders = selectedCategory === "PRODUCT" ? ordersWithProduct : ordersWithSetup;

    if (activeTab === "ALL") {
      return baseOrders.filter((order) => order.oderCode.toLowerCase().includes(searchValue.toLowerCase()));
    }
    if (activeTab === "RETURN") {
      return baseOrders.filter((order) => order.status === "RETURNING" || order.status === "RETURNED");
    }
    return baseOrders.filter((order) => order.status === activeTab);
  })();

  return (
    <OrderListScreenWrapper className="page-py-spacing">
      {isLoading && isLoadingProfile ? (
        <LoadingPage />
      ) : (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <UserDashboardWrapper>
            <UserMenu />
            <UserContent>
              <div className="header">
                <Title titleText={"Đơn hàng"} />
                <div className="inline-block ml-4">
                  <select value={selectedCategory} onChange={handleCategoryChange} className="p-2 border rounded-md">
                    <option value="PRODUCT">Sản phẩm</option>
                    <option value="FISH_TANK">Hồ Cá</option>
                  </select>
                </div>
              </div>
              <div className="order-tabs mb-12">
                <div className="order-tabs-heads p-8">
                  {(
                    [
                      "ALL",
                      "PROCESSING",
                      "PROCESSED",
                      "PENDING_DELIVERY",
                      "COMPLETED",
                      "CANCELLED",
                      "RETURN",
                    ] as OrderStatus[]
                  ).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`order-tabs-head mr-3 text-xl italic ${
                        activeTab === key ? "order-tabs-head-active" : ""
                      }`}
                      onClick={() => handleTabClick(key as OrderStatus)}
                    >
                      {key === "ALL" && "Tất cả"}
                      {key === "PROCESSING" && "Đang xử lý"}
                      {key === "PROCESSED" && "Đã xử lý"}
                      {key === "PENDING_DELIVERY" && "Chờ giao hàng"}
                      {key === "COMPLETED" && "Đã giao hàng"}
                      {key === "CANCELLED" && "Đã hủy"}
                      {key === "RETURN" && "Trả hàng"}
                    </button>
                  ))}
                </div>
                {/* Thanh search chỉ hiện khi là tab ALL */}
                {activeTab === "ALL" && (
                  <div className="px-8">
                    <input
                      type="text"
                      placeholder="Tìm theo mã đơn hàng"
                      className="dark:bg-dark-900 h-11 w-1/2 rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                )}
                <div className="order-tabs-contents">
                  {isLoading ? (
                    <LoadingPage />
                  ) : filteredOrders.length > 0 ? (
                    <OrderItemList orders={filteredOrders} />
                  ) : (
                    <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
                  )}
                </div>
              </div>
            </UserContent>
          </UserDashboardWrapper>
        </Container>
      )}
    </OrderListScreenWrapper>
  );
};

export default OrderListScreen;
