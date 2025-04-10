import Breadcrumb from "@common/Breadcrum";
import Title from "@common/Title";
import UserMenu from "@atom/user/UserMenu";
import { Container } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { UserContent, UserDashboardWrapper } from "@styles/user";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "@redux/slices/userSlice";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import BookingHistory from "./BookingHistory";
import { getAllBookingofUsers } from "@redux/slices/bookingSlice";

type BookingStatus = "ALL" | "NOTASSIGN" | "DONE" | "PROCESSING" | "CANCELLED" | "ASSIGNED" | "MISSED";

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
  { label: "Danh sách bảo trì", link: "/booking-history" },
];
const BookingHistoryListSCreen = () => {
  const dispatch = useAppDispatch();
  const bookings = useAppSelector((state) => state.bookingService.bookingList) || [];
  const [activeTab, setActiveTab] = useState<BookingStatus>("ALL");
  const isLoadingBooking = useAppSelector((state) => state.bookingService.loading);
  const isLoadingProfile = useAppSelector((state) => state.userProfile.isLoading);
  //search
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);
  useEffect(() => {
    if (activeTab === "ALL") {
      dispatch(getAllBookingofUsers()); // không truyền status
    } else {
      const statusToSend = activeTab === "NOTASSIGN" ? undefined : activeTab;
      dispatch(getAllBookingofUsers(statusToSend));
    }
  }, [dispatch, activeTab]);
  useEffect(() => {
    if (activeTab === "ALL" && searchValue.trim() === "") {
      dispatch(getAllBookingofUsers());
    }
  }, [searchValue, activeTab, dispatch]);

  const handleTabClick = (tab: BookingStatus) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  const filteredBookings = useMemo(() => {
    const baseBookings =
      activeTab === "NOTASSIGN"
        ? bookings.filter((b) => b.status === null || b.status === "NOTASSIGN")
        : activeTab === "ALL"
        ? bookings
        : bookings.filter((b) => b.status === activeTab);

    if (activeTab === "ALL") {
      return baseBookings.filter((b) => b.bookingCode?.toLowerCase().includes(searchValue.toLowerCase()));
    }

    return baseBookings;
  }, [bookings, activeTab, searchValue]);

  return (
    <OrderListScreenWrapper className="page-py-spacing">
      {isLoadingBooking && isLoadingProfile ? (
        <LoadingPage />
      ) : (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <UserDashboardWrapper>
            <UserMenu />
            <UserContent>
              <div className="header">
                <Title titleText={"Danh sách bảo trì"} />
              </div>
              <div className="order-tabs mb-12">
                <div className="order-tabs-heads p-8">
                  {(
                    ["ALL", "NOTASSIGN", "ASSIGNED", "PROCESSING", "DONE", "CANCELLED", "MISSED"] as BookingStatus[]
                  ).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`order-tabs-head mr-7 text-xl italic ${
                        activeTab === key ? "order-tabs-head-active" : ""
                      }`}
                      onClick={() => handleTabClick(key as BookingStatus)}
                    >
                      {key === "ALL" && "Tất cả"}
                      {key === "NOTASSIGN" && "Chưa bắt đầu"}
                      {key === "ASSIGNED" && "Đã phân công"}
                      {key === "PROCESSING" && "Đang tiến hành"}
                      {key === "DONE" && "Hoàn thành"}
                      {key === "CANCELLED" && "Đã hủy"}
                    </button>
                  ))}
                </div>
                {activeTab === "ALL" && (
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn hàng..."
                    value={searchValue}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase();
                      setSearchValue(value);
                    }}
                    className="dark:bg-dark-900 h-11 w-1/2 rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                  />
                )}

                <div className="order-tabs-contents">
                  {isLoadingBooking ? (
                    <LoadingPage></LoadingPage>
                  ) : bookings.length > 0 ? (
                    <BookingHistory bookings={filteredBookings} />
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

export default BookingHistoryListSCreen;
