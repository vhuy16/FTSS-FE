import Breadcrumb from "@common/Breadcrumb";
import Title from "@common/Title";
import UserMenu from "@components/atom/user/UserMenu";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { deleteSetup, getSetupPackages } from "@redux/slices/setupSlice";
import { BaseBtnGreen, BaseLinkBlack } from "@styles/button";
import { Container } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { UserContent, UserDashboardWrapper } from "@styles/user";
import { currencyFormat, formatDate } from "@ultils/helper";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import beca from "@images/beca.jpg";
import Loading from "@components/atom/Loading/Loading";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import { getUserProfile } from "@redux/slices/userSlice";
import SimpleModal, { ModalContent, ModalHeader } from "@components/atom/modal/Modal";
import { getAllOrdersByUsers } from "@redux/slices/orderListSlice";
import { getAllBookingofUsers } from "@redux/slices/bookingSlice";
import { getOrderById } from "@redux/slices/orderSlice";
const WishListScreenWrapper = styled.main`
  .wishlist {
    gap: 20px;
  }
`;

const WishItemWrapper = styled.div`
  gap: 30px;
  max-width: 1500px;
  position: relative;
  background-color: #fff;
  border-radius: 0.3rem !important;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: ${breakpoints.xl}) {
    column-gap: 20px;
  }

  @media (max-width: ${breakpoints.lg}) {
    column-gap: 16px;
  }

  @media (max-width: ${breakpoints.xs}) {
    flex-direction: column;
    gap: 12px;
  }

  .wish-item-img {
    column-gap: 30px;

    @media (max-width: ${breakpoints.xl}) {
      column-gap: 20px;
    }

    @media (max-width: ${breakpoints.lg}) {
      column-gap: 16px;
    }

    &-wrapper {
      min-width: 110px;
      width: 110px;
      border-radius: 4px;
      overflow: hidden;

      @media (max-width: ${breakpoints.xs}) {
        min-width: 100%;
        height: 180px;

        img {
          object-position: top;
        }
      }
    }

    .wish-remove-btn {
      width: 20px;
      min-width: 20px;
      height: 20px;
      border: 1px solid ${defaultTheme.color_outerspace};
      border-radius: 50%;
      font-size: 10px;
      margin-top: auto;
      margin-bottom: auto;

      &:hover {
        background-color: ${defaultTheme.color_gray};
        color: ${defaultTheme.color_white};
        border-color: ${defaultTheme.color_gray};
      }

      @media (max-width: ${breakpoints.sm}) {
        position: absolute;
        right: -10px;
        top: -10px;
      }

      @media (max-width: ${breakpoints.xs}) {
        right: 6px;
        top: 6px;
        background-color: ${defaultTheme.color_jet};
        color: ${defaultTheme.color_white};
      }
    }
  }

  .wish-item-info {
    flex: 1;

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
      row-gap: 8px;
    }

    &-l {
      row-gap: 4px;

      ul {
        row-gap: 4px;
        li {
          span {
            &:last-child {
              margin-left: 4px;
            }
          }
        }
      }
    }

    &-r {
      column-gap: 40px;

      @media (max-width: ${breakpoints.xl}) {
        column-gap: 20px;
      }

      @media (max-width: ${breakpoints.lg}) {
        flex-direction: column;
        align-items: flex-end;
        row-gap: 8px;
      }

      @media (max-width: ${breakpoints.sm}) {
        flex-direction: row;
        align-items: center;
      }

      .wish-item-price {
        @media (max-width: ${breakpoints.sm}) {
          order: 2;
        }
      }

      .wish-cart-btn {
        @media (max-width: ${breakpoints.sm}) {
          order: 1;
        }
      }
    }
  }
`;

const breadcrumbItems = [
  { label: "Home", link: "/" },
  { label: "Danh sách bảo trì", link: "/setup-booking" },
];

const SetupBookingList = () => {
  const listBooking = useAppSelector((state) => state.bookingService.bookingList) || [];
  const isLoadingBooking = useAppSelector((state) => state.bookingService.loading);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getAllBookingofUsers());
  }, []);
  const navigate = useNavigate();

  console.log("booking", listBooking);
  return (
    <WishListScreenWrapper className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <div className="header">
              <Title titleText={"Danh sách đặt lịch"} />
            </div>
            <div className="order-tabs-contents">
              {isLoadingBooking ? (
                <LoadingPage />
              ) : listBooking && Array.isArray(listBooking) && listBooking.length > 0 ? (
                <div className="wishlist grid">
                  {listBooking?.map((booking) => {
                    return (
                      <WishItemWrapper className="wish-item flex" key={booking.id}>
                        <div className="wish-item-img flex items-stretch">
                          <div className="wish-item-img-wrapper">
                            <div>{formatDate(booking.scheduleDate)}</div>
                          </div>
                        </div>
                        <div className="wish-item-info flex justify-between">
                          <div className="wish-item-info-l flex flex-col">
                            <p className="wish-item-title text-xl font-bold text-outerspace">{booking.status}</p>
                            <ul className="flex flex-col">
                              <li>
                                <span className="text-lg font-bold">Mã đặt dịch vụ :</span>
                                <span className="text-lg text-gray font-medium capitalize">{booking.id}</span>
                              </li>
                              <li>
                                <span className="text-lg font-bold">Mô tả:</span>
                                <span className="text-lg text-gray font-medium capitalize">{booking.phoneNumber}</span>
                              </li>
                            </ul>
                          </div>
                          <div className="wish-item-info-r flex items-center">
                            <span className="wish-item-price text-xl text-red font-bold">
                              {currencyFormat(booking.totalPrice)}
                            </span>
                            <BaseBtnGreen className="wish-cart-btn">Xem chi tiết</BaseBtnGreen>
                          </div>
                        </div>
                      </WishItemWrapper>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-600 text-xl mt-6">Không có setup nào. Vui lòng tạo !!</div>
              )}
            </div>
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </WishListScreenWrapper>
  );
};

export default SetupBookingList;
