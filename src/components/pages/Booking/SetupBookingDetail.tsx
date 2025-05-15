import { useEffect } from "react";
import { FaClock, FaCheck, FaTimes, FaRegMoneyBillAlt } from "react-icons/fa";
import { BookingServiceStyle } from "./BookingServiceStyle";
import { Container, HorizontalLine } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { currencyFormat, formatDate } from "@ultils/helper";
import { useParams } from "react-router-dom";
import { getOrderById } from "@redux/slices/orderSlice";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import styled from "styled-components";
import { getAllServiceSetupHistory } from "@redux/slices/historyServiceSetupSlice";

const OrderDetailScreenWrapper = styled.main`
  .order-summary {
    width: 100%;
    margin-top: 2.5rem;
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
const SetupBookingDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const orderDetail = useAppSelector((state) => state.order.order);
  const isLoadingDetail = useAppSelector((state) => state.order.isLoading);
  const servicehistory = useAppSelector((state) => state.historyService.ListServiceHistory);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getOrderById(orderId as string));
    dispatch(getAllServiceSetupHistory(orderId as string));
  }, [orderId, dispatch]);
  const products = orderDetail?.setupPackage?.products;
  const subtotal = products?.reduce((acc, product) => {
    const quantity = product.quantity ?? 0;
    const price = product.price ?? 0;
    return acc + quantity * price;
  }, 0);

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Hồ cá của tôi", link: "/setup-booking" },
    { label: "Thông tin chi tiết hồ cá", link: `/setup-booking/detail/${orderId}` },
  ];
  const PaymentStatus = ({ status }: { status: string }) => (
    <div
      className={`flex items-center gap-1 ${
        status === "Completed" || status === "Refunded"
          ? "text-green-600"
          : status === "Processing" || status === "Refunding"
          ? "text-gray-500"
          : status === "Cancelled"
          ? "text-red-600"
          : "text-gray-600"
      }`}
    >
      {status === "Completed" ? (
        <FaCheck />
      ) : status === "Cancelled" ? (
        <FaTimes />
      ) : status === "Processing" || status === "Refunding" ? (
        <FaClock />
      ) : status === "Refunded" ? (
        <FaRegMoneyBillAlt />
      ) : null}
      <span className="font-medium">
        {status === "Completed"
          ? "Đã thanh toán"
          : status === "Cancelled"
          ? "Đã huỷ"
          : status === "Processing"
          ? "Đang chờ thanh toán"
          : status === "Refunded"
          ? "Đã hoàn tiền"
          : status === "Refunding"
          ? "Đang hoàn tiền"
          : "Không xác định"}
      </span>
    </div>
  );
  const maintenanceData = [
    {
      date: "13/04/2025",
      services: ["Vệ sinh bể", "Thay nước", "Kiểm tra hệ thống lọc"],
    },
    {
      date: "27/04/2025",
      services: ["Bổ sung vi sinh", "Thay đèn LED"],
    },
  ];
  return (
    <BookingServiceStyle>
      {isLoadingDetail ? (
        <LoadingPage />
      ) : (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <div className="bookingContainer">
            <div className="order-d-top flex justify-between items-start ">
              {/* Bên trái */}
              <div className="order-d-top-l w-2/3 pr-4">
                <h4 className="text-3xl order-d-no mb-2">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Mã đặt hàng:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-500 ">
                      {orderDetail?.oderCode}
                    </span>
                  </div>
                </h4>
                <p className="text-lg font-medium text-gray mb-1">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Ngày đặt:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {formatDate(orderDetail?.createDate || "")}
                    </span>
                  </div>
                </p>
                <p className="text-lg font-medium text-gray mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Trạng thái thanh toán:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      <PaymentStatus status={orderDetail?.payment?.paymentStatus ?? "UNKNOWN"} />
                    </span>
                  </div>
                </p>

                <p className="text-lg font-medium text-gray">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Phương thức thanh toán:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {orderDetail?.payment?.paymentMethod === "COD"
                        ? "Thanh toán khi nhận hàng"
                        : orderDetail?.payment?.paymentMethod}
                    </span>
                  </div>
                </p>
              </div>
              {/* Bên phải */}
              <div className="order-d-top-r w-1/3 pl-4">
                <p className="text-lg font-medium text-gray mb-1">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Người nhận:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {orderDetail?.buyerName}
                    </span>
                  </div>
                </p>

                <p className="text-lg font-medium text-gray mb-1">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">Địa chỉ:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {orderDetail?.address}
                    </span>
                  </div>
                </p>

                <p className="text-lg font-medium text-gray mb-1">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-bold mr-2">SĐT:</span>
                    <span className="px-3 py-1 rounded-md text-xl font-medium text-gray-600 ">
                      {orderDetail?.phoneNumber}
                    </span>
                  </div>
                </p>
              </div>
            </div>
            <HorizontalLine />

            <div className="flexContainer">
              <div className="build-info">
                <h1 className="title">{orderDetail?.setupPackage?.setupName}</h1>
                <div className="iconText">
                  {/* <FaWater className="icon" /> */}
                  <span>Size: {orderDetail?.setupPackage?.size}</span>
                </div>
                <p className="description">Mô tả: {orderDetail?.setupPackage?.description}</p>
              </div>
            </div>
            <div className="product">
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
            <OrderDetailScreenWrapper>
              <div className="order-summary">
                <table className="w-full border-separate border-spacing-y-2">
                  <tbody>
                    <tr>
                      <td className="text-right text-gray-500">Tổng phụ</td>
                      <td className="text-right">{currencyFormat(subtotal ?? 0)}</td>
                    </tr>
                    <tr>
                      <td className="text-right text-gray-500">Giảm giá</td>
                      <td className="text-right">
                        -
                        {currencyFormat(
                          (subtotal ?? 0) + (orderDetail?.shipCost ?? 0) - (orderDetail?.totalPrice ?? 0)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-right text-gray-500">Phí vận chuyển</td>
                      <td className="text-right">{currencyFormat(orderDetail?.shipCost ?? 0)}</td>
                    </tr>
                    <tr className="border-t border-gray-300">
                      <td className="text-right font-bold">Thành tiền</td>
                      <td className="text-right text-4xl font-bold text-red-500">
                        {currencyFormat(orderDetail?.totalPrice ?? 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </OrderDetailScreenWrapper>
            <HorizontalLine />
            {/* //lich su bao tritri */}
            {servicehistory ? (
              <div className=" rounded-lg shadow-md p-6 mt-3">
                <h2 className="text-lg font-semibold mb-4">🛠️ Lịch sử bảo trì</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                      <tr>
                        <th className="text-xl font-semibold text-gray-600 w-1/4">Ngày bảo trì</th>
                        <th className="text-xl font-semibold text-gray-600">Dịch vụ đã thực hiện</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicehistory.map((item, index) => (
                        <tr key={index} className="border-b border-gray-800 last:border-b-0">
                          <td className="align-top py-2 text-xl text-gray-800">{formatDate(item.scheduleDate)}</td>
                          <td className="py-2 text-xl text-gray-800">
                            <ul className="list-disc list-inside space-y-1">
                              {item.services.map((service, idx) => (
                                <li key={idx}>{service.serviceName}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Container>
      )}
    </BookingServiceStyle>
  );
};

export default SetupBookingDetail;
