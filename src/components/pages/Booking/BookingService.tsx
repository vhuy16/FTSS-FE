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

const BookingService = () => {
  const { setupBookingId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const services = useAppSelector((state) => state.serviceList.servicePackages);
  const orderDetail = useAppSelector((state) => state.order.order);
  const isLoadingDetail = useAppSelector((state) => state.order.isLoading);
  const isLoadingBooking = useAppSelector((state) => state.bookingService.loading);
  const unavailableDates = useAppSelector((state) => state.bookingService.unavailableDates);
  const [disabledDates, setDisabledDates] = useState<Dayjs[]>([]);
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
    dispatch(getAllUnavailableDates());
  }, [dispatch]);
  useEffect(() => {
    if (unavailableDates.length > 0) {
      const formattedDates = unavailableDates.map((item) => dayjs(item.scheduleDate));
      setDisabledDates(formattedDates);
    }
  }, [unavailableDates]);
  useEffect(() => {
    if (orderDetail?.isEligible) {
      setSelectedServices(services.map((s) => s.id)); // Chọn tất cả dịch vụ
    } else {
      setSelectedServices([]);
    }
  }, [orderDetail?.isEligible, services]);
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };
  const formattedDate = selectedDate?.format("YYYY-MM-DD");

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
      !selectedDate ||
      selectedServices.length === 0 ||
      !selectedDate ||
      selectedServices.length === 0 ||
      !formValue.customer_name ||
      !formValue.Address ||
      !formValue.district ||
      !formValue.phone ||
      !formValue.ward ||
      !formValue.province ||
      !formValue.street
    ) {
      toast("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    try {
      const bookingData = {
        serviceIds: selectedServices.map((id) => ({ serviceId: id })),
        orderId: setupBookingId,
        scheduleDate: formattedDate,
        address: `${formValue.street}, ${formValue.ward}, ${formValue.district}, ${formValue.province}`,
        phoneNumber: formValue.phone,
        fullName: formValue.customer_name,
      };

      const response = await dispatch(createBookingService(bookingData));
      // Xử lý kết quả
      if (response?.payload?.status === "200" || response?.payload?.status === "201") {
        toast.success("Đặt dịch vụ thành công!");
        navigate(`/booking-history`);
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
            <InfoWrapper>
              <BookingContainer>
                <BookingInfo setFormValues={setFormValue} formValues={formValue} />
              </BookingContainer>
              <CalendarContainer>
                <h2 className="sectionTitle">Chọn ngày</h2>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DateCalendar
                      value={selectedDate}
                      onChange={handleDateChange}
                      shouldDisableDate={(date) => {
                        const next7Days = dayjs().add(7, "day"); // Định nghĩa next7Days trong hàm
                        return (
                          date.isBefore(dayjs(), "day") || // Không cho chọn ngày trước hiện tại
                          date.isAfter(next7Days, "day") || // Không cho chọn ngày sau 7 ngày tiếp theo
                          disabledDates.some((disabledDate) => date.isSame(disabledDate, "day")) ||
                          date.isSame(dayjs(), "day") // k cho chon ngay hien tai
                        );
                      }}
                      slotProps={{
                        day: (ownerState) => ({
                          className:
                            ownerState.day.isBefore(dayjs(), "day") ||
                            ownerState.day.isAfter(dayjs().add(7, "day"), "day") ||
                            disabledDates.some((d) => ownerState.day.isSame(d, "day")) ||
                            ownerState.day.isSame(dayjs(), "day")
                              ? "unavailable-day"
                              : "",
                        }),
                      }}
                      sx={{
                        bgcolor: "white",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",

                        "& .MuiPickersDay-root": {
                          fontSize: "17px",
                          fontWeight: "bold",
                          transition: "0.3s",
                          "&.Mui-selected": {
                            color: "white",
                            backgroundColor: "#10b9b0",
                          },
                          "&:hover": {
                            backgroundColor: "#10b9b0",
                          },
                        },
                        "& .MuiPickersCalendarHeader-root": {
                          borderRadius: "8px",
                          fontWeight: "bold",
                        },
                        "& .MuiPickersArrowSwitcher-root": {
                          color: "white",
                        },
                        "& .MuiPickersDay-today": {
                          border: "2px solid #10b9b0",
                        },
                        "& .MuiPickersCalendarHeader-label": {
                          fontSize: "18px",
                          fontWeight: "bold",
                        },
                        "& .MuiPickersCalendarHeader-switchViewButton": {
                          color: "white",
                        },
                        "& .MuiDayCalendar-weekDayLabel": {
                          fontSize: "14px",
                          fontWeight: "bold",
                        },
                        "& .MuiPickersDay-root.unavailable-day": {
                          position: "relative",
                          textDecoration: "none",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            width: "60%",
                            height: "2px",
                            backgroundColor: "gray", // Màu gạch ngang
                            bottom: "50%",
                          },
                        },
                      }}
                      dayOfWeekFormatter={(day) => {
                        const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
                        return weekdays[dayjs(day, "dd").day()];
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </CalendarContainer>
            </InfoWrapper>
            <BaseBtnGreen
              disabled={
                !selectedDate ||
                selectedServices.length === 0 ||
                !formValue.customer_name ||
                !formValue.Address ||
                !formValue.district ||
                !formValue.phone ||
                !formValue.ward ||
                !formValue.province ||
                !formValue.street
              }
              className={`bookButton ${
                selectedDate &&
                selectedServices.length > 0 &&
                formValue.customer_name &&
                formValue.Address &&
                formValue.district &&
                formValue.phone &&
                formValue.street &&
                formValue.province &&
                formValue.ward
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
