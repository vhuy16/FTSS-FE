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
    dispatch(getOrderById(bookingDetail?.orderId as string));
  }, [dispatch]);

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
      ) : (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <div className="booking">
            <div className="flexContainer">
              <div className="build-info">
                <h1 className="title">Đặt lịch: #{bookingDetail?.id}</h1>
                <div className="iconText">
                  {/* <FaWater className="icon" /> */}
                  <span>Trạng thái: {bookingDetail?.status}</span>
                </div>
                <p className="description">Ngày đặt: {bookingDetail?.scheduleDate}</p>
              </div>
            </div>
            <HorizontalLine />
            <div className="setup">
              <div className="flexContainer">
                <div className="build-info">
                  <h1 className="title-setup">{orderDetail?.setupPackage?.setupName}</h1>
                  <div className="iconText">
                    {/* <FaWater className="icon" /> */}
                    <span>Size: {orderDetail?.setupPackage?.size}</span>
                  </div>
                  <p className="description">Mô tả: {orderDetail?.setupPackage?.description}</p>
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
            {/* <div className="totalPrice mt-5 font-bold text-xl">
              Tổng tiền: <span className=" text-red-500 font-bold text-xl">{currencyFormat(totalPrice)}</span>
            </div> */}
          </div>
        </Container>
      )}
    </BookingServiceStyle>
  );
};

export default BookingHistoryDetail;
