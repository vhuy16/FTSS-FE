import { useEffect, useState } from "react";
import { FaClock, FaWater, FaFish } from "react-icons/fa";
import { BookingContainer, BookingServiceStyle, CalendarContainer, InfoWrapper } from "./BookingServiceStyle";
import { Container, HorizontalLine, HorizontalLineTAb } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { Order } from "@redux/slices/orderListSlice";
import BookingInfo from "./BookingInfo";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { Box } from "@mui/material";
import { getAllServices, ServicePackage } from "@redux/slices/listServiceSlice";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { currencyFormat } from "@ultils/helper";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "@redux/slices/orderSlice";
import { toast } from "react-toastify";
import { createBookingService, getAllUnavailableDates } from "@redux/slices/bookingSlice";
import { BaseBtnGreen } from "@styles/button";
import Loading from "@components/atom/Loading/Loading";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import FormSchedule from "@components/atom/FormSchedule/FormSchedule";

const BookingService = () => {
  const { setupBookingId } = useParams();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const services = useAppSelector((state) => state.serviceList.servicePackages);
  const orderDetail = useAppSelector((state) => state.order.order);
  const isLoadingDetail = useAppSelector((state) => state.order.isLoading);
  const isLoadingBooking = useAppSelector((state) => state.bookingService.loading);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [infoDefault, setInfoDefault] = useState(false);

  const handleInfoDefaultChange = (value: boolean) => {
    setInfoDefault(value);
  };
  //thong tin
  const initFormValue = {
    Address: "",
    phone: "",
    customer_name: "",
    street: "",
    district: "",
    province: "",
    ward: "",
  };
  const [formValue, setFormValue] = useState(initFormValue);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getOrderById(setupBookingId as string));
    dispatch(getAllServices());
  }, [dispatch]);
  useEffect(() => {
    if (orderDetail?.isEligible) {
      setSelectedServices(services.map((s) => s.id)); // Chọn tất cả dịch vụ
    } else {
      setSelectedServices([]);
    }
  }, [orderDetail?.isEligible, services]);

  const products = orderDetail?.setupPackage?.products;

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      const newServices = new Set(prev);
      newServices.has(serviceId) ? newServices.delete(serviceId) : newServices.add(serviceId);
      return Array.from(newServices);
    });
  };
  const navigate = useNavigate();
  const handleSave = async () => {
    if (
      selectedServices.length === 0 ||
      !selectedSchedule ||
      (!infoDefault &&
        (!formValue.district || !formValue.phone || !formValue.ward || !formValue.province || !formValue.street))
    ) {
      toast("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    try {
      const bookingData = {
        serviceIds: selectedServices.map((id) => ({ serviceId: id })),
        orderId: setupBookingId,
        scheduleDate: selectedSchedule,
        address: infoDefault
          ? formValue.Address
          : formValue.street + ", " + formValue.ward + ", " + formValue.district + ", " + formValue.province,
        phoneNumber: formValue.phone,
        paymentMethod: "VnPay",
      };

      const response = await dispatch(createBookingService(bookingData));
      // Xử lý kết quả
      if (response?.payload?.status === "200" || response?.payload?.status === "201") {
        if (orderDetail?.isEligible) {
          toast.success("Đặt lịch bảo trì thành công");
          navigate("/booking-history");
        } else {
          await toast.success("Vui lòng chờ để thanh toán");
          setTimeout(() => {
            window.location.href = response?.payload?.data.url;
          }, 1000);
        }
      } else {
        toast.error(response?.payload);
      }
    } catch (error) {
      console.error("Lỗi khi lưu setup package:", error);
      toast.error("Lưu thất bại, vui lòng thử lại.");
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Đặt lịch", link: "/booking" },
  ];

  // tong tien dich vuvu
  const totalPrice = orderDetail?.isEligible
    ? 0
    : services
        .filter((service) => selectedServices.includes(service.id))
        .reduce((acc, service) => acc + service.price, 0);
  console.log("form", formValue);
  return (
    <BookingServiceStyle>
      {isLoadingDetail ? (
        <LoadingPage />
      ) : (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <div className="bookingContainer">
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
            <HorizontalLine />
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
            <HorizontalLine />
            <div className="p-15">
              <BookingContainer>
                <BookingInfo
                  setFormValues={setFormValue}
                  formValues={formValue}
                  orderDetail={orderDetail}
                  infoDefault={infoDefault}
                  setInfoDefault={handleInfoDefaultChange}
                />
              </BookingContainer>
            </div>
            {/* chọn dịch vụ  */}
            <div className="service">
              <h2 className="sectionTitle">Chọn loại dịch vụ</h2>
              {orderDetail?.isEligible && (
                <p className=" text-red-500 font-bold mb-7 text-xl ">
                  Bạn nhận được 1 lần bảo trì miễn phí với tất cả dịch vụ vì hóa đơn trên 2 triệu*
                </p>
              )}
              <div className="serviceGrid">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`serviceButton ${selectedServices.includes(service.id) ? "selected" : "unselected"}`}
                    disabled={orderDetail?.isEligible} // Nếu đủ điều kiện, disable để giữ chọn tất cả dịch vụ
                  >
                    <div className="service-name">{service.serviceName}</div>
                    <div className="service-price">{currencyFormat(service.price)}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="totalPrice mt-5 font-bold text-xl">
              Tổng tiền: <span className=" text-red-500 font-bold text-xl">{currencyFormat(totalPrice)}</span>
            </div>
            <HorizontalLine />
            {/* //date time  */}
            <FormSchedule setSelectedSchedule={setSelectedSchedule} />
            <BaseBtnGreen
              disabled={
                selectedServices.length === 0 ||
                !selectedSchedule ||
                (!infoDefault &&
                  (!formValue.district ||
                    !formValue.phone ||
                    !formValue.ward ||
                    !formValue.province ||
                    !formValue.street))
              }
              className={`bookButton ${
                selectedServices.length > 0 &&
                selectedSchedule &&
                (infoDefault ||
                  (formValue.district && formValue.phone && formValue.ward && formValue.province && formValue.street))
                  ? "enabled"
                  : "disabled"
              }`}
              onClick={handleSave}
            >
              {isLoadingBooking ? <Loading /> : "Đặt lịch "}
            </BaseBtnGreen>
          </div>
        </Container>
      )}
    </BookingServiceStyle>
  );
};

export default BookingService;
