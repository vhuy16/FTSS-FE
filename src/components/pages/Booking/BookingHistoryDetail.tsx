import { useEffect, useState } from "react";
import { FaClock, FaWater, FaFish } from "react-icons/fa";
import { Container, HorizontalLine, HorizontalLineTAb } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { Order } from "@redux/slices/orderListSlice";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { currencyFormat, formatDate } from "@ultils/helper";
import { useParams } from "react-router-dom";
import { getOrderById } from "@redux/slices/orderSlice";
import { getDetailBookingofUsers } from "@redux/slices/bookingSlice";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import { BookingServiceStyle } from "./BookingServiceStyle";

const BookingHistoryDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const bookingDetail = useAppSelector((state) => state.bookingService.bookingDetail);
  const orderDetail = useAppSelector((state) => state.order.order);
  const isLoadingDetail = useAppSelector((state) => state.order.isLoading);
  const isLoadingBooking = useAppSelector((state) => state.bookingService.loading);
  const unavailableDates = useAppSelector((state) => state.bookingService.unavailableDates);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getDetailBookingofUsers(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    if (bookingDetail?.orderId) {
      dispatch(getOrderById(bookingDetail.orderId));
    }
  }, [dispatch, bookingDetail?.orderId]);
  const products = orderDetail?.setupPackage?.products;

  console.log("orde", orderDetail);

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Đặt lịch", link: "/booking" },
  ];

  // tong tien dich vuvu
  // const totalPrice = orderDetail?.isEligible
  //   ? 0
  //   : services
  //       .filter((service) => selectedServices.includes(service.id))
  //       .reduce((acc, service) => acc + service.price, 0);
  return (
    <BookingServiceStyle>
      {isLoadingDetail ? (
        <LoadingPage />
      ) : orderDetail ? (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <div className="booking">
            <div className="flexContainer">
              <div className="build-info">
                <h1 className="title">
                  <span className="text-title">Đặt lịch: </span> #{bookingDetail?.id}
                </h1>
                <div className="iconText">
                  {/* <FaWater className="icon" /> */}
                  <p>
                    <span className="text-title">Trạng thái: </span>{" "}
                    {bookingDetail?.status == "NOTPAID"
                      ? "Đang chờ thanh toán"
                      : orderDetail.payment.paymentStatus == "PAID"
                      ? "Đã thanh toán"
                      : "Miễn phí"}
                  </p>
                </div>
                <p className="description">
                  <span className="text-title">Ngày đặt: </span>{" "}
                  {bookingDetail?.scheduleDate ? formatDate(bookingDetail.scheduleDate) : "Chưa có ngày"}
                </p>
              </div>
              <div className="customer-info">
                <div className="title">Thông tin người đặt dịch vụ</div>
                <p className="description">
                  <span className="text-title">Tên: </span> {bookingDetail?.fullName}
                </p>
                <p className="description">
                  <span className="text-title">SĐT: </span> {bookingDetail?.phoneNumber}
                </p>
                <p className="description">
                  <span className="text-title">Địa chỉ: </span> {bookingDetail?.address}
                </p>
              </div>
            </div>
            <HorizontalLine />
            <div className="setup">
              <div className="flexContainer">
                <div className="build-info">
                  <h1 className="title-setup">{orderDetail?.setupPackage?.setupName}</h1>
                  <div className="iconText">
                    {/* <FaWater className="icon" /> */}
                    <p>
                      {" "}
                      <span className="text-title">Size: </span> {orderDetail?.setupPackage?.size}
                    </p>
                  </div>
                  <p className="description">
                    <span className="text-title">Mô tả: </span> {orderDetail?.setupPackage?.description}
                  </p>
                </div>
              </div>
              <h2 className="sectionTitle">Sản phẩm</h2>
              <div className="productContainer">
                {products?.map((product) => (
                  <div key={product.id} className="productCard">
                    <img src={product.images} alt={product.productName} className="productImage" />
                    <h3 className="productName">{product.productName}</h3>
                    <p className="productDescription">Số lượng: {product.quantity}</p>
                    <p className="productPrice">{currencyFormat(product.price)}</p>
                  </div>
                ))}
              </div>
            </div>
            <HorizontalLine />
            <div className="service">
              <h2 className="sectionTitle">Dịch vụ</h2>
              <div className="serviceGrid">
                {bookingDetail?.services?.map((service) => (
                  <button key={service.id} className={`serviceButton selected`}>
                    <div className="service-name">{service.serviceName}</div>
                    <div className="service-price">{currencyFormat(service.price)}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="totalPrice mt-5 font-bold text-xl">
              Tổng tiền:{" "}
              <span className=" text-red-500 font-bold text-xl">
                {currencyFormat(
                  bookingDetail?.services?.reduce((total, service) => total + (service.price ?? 0), 0) ?? 0
                )}
              </span>
            </div>

            <HorizontalLine />
            <div className="flex justify-center items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-100 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Chi tiết thanh toán</h3>
                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                  <div className="flex justify-between w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">Tổng phụ</p>
                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                      {currencyFormat(
                        bookingDetail?.services?.reduce((total, service) => total + (service.price ?? 0), 0) ?? 0
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">Phí đi lại</p>
                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                      {currencyFormat(orderDetail.shipCost)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Tổng</p>
                  <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                    {currencyFormat(bookingDetail?.totalPrice ?? 0)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-100 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Thanh toán</h3>
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center w-full space-y-4 flex-col  pb-4">
                    <div className="flex justify-between w-full">
                      <p className="text-base dark:text-white leading-4 text-gray-800">Phương thức thanh toán</p>
                      <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                        {orderDetail.payment.paymentMethod}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base dark:text-white leading-4 text-gray-800">Trạng thái</p>
                      <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                        {orderDetail.payment.paymentStatus == "Processing"
                          ? "Đang chờ thanh toán"
                          : orderDetail.payment.paymentStatus == "Completed"
                          ? "Đã thanh toán"
                          : "Đã hủy"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      ) : (
        <></>
      )}
    </BookingServiceStyle>
  );
};

export default BookingHistoryDetail;
