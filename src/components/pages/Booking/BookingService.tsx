import { useState } from "react";
import { FaClock, FaWater, FaFish } from "react-icons/fa";
import { BookingContainer, BookingServiceStyle, CalendarContainer, InfoWrapper } from "./BookingServiceStyle";
import { Container, HorizontalLine, HorizontalLineTAb } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { Order } from "@redux/slices/orderListSlice";
import BookingInfo from "./BookingInfo";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Box } from "@mui/material";

interface Service {
  id: number;
  name: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const BookingService = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });

  const dates = [
    { day: "WED", date: "19" },
    { day: "THU", date: "20" },
    { day: "FRI", date: "21" },
    { day: "SAT", date: "22" },
    { day: "SUN", date: "23" },
  ];

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const services: Service[] = [
    { id: 1, name: "Water Change", price: 50 },
    { id: 2, name: "Filter Cleaning", price: 30 },
    { id: 3, name: "Algae Removal", price: 40 },
    { id: 4, name: "Fish Health Check", price: 45 },
    { id: 5, name: "Tank Decoration Setup", price: 60 },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "Premium Water Filter",
      description: "High-performance filtration system",
      price: 199,
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    },
    {
      id: 2,
      name: "LED Aquarium Light",
      description: "Full spectrum LED lighting",
      price: 129,
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    },
    {
      id: 3,
      name: "Water Conditioner",
      description: "Professional grade water treatment",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    },
  ];

  const toggleService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleDateSelect = (selectInfo: any) => {
    const date = new Date(selectInfo.start);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = date.getDate();

    setSelectedDate(`${day} ${formattedDate}`);
  };
  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Đặt lịch", link: "/booking" },
  ];
  return (
    <BookingServiceStyle>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <div className="bookingContainer">
          <div className="flexContainer">
            <div className="imageContainer">
              <img
                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
                alt="Ocean Blue Premium Aquarium"
                className="image"
              />
            </div>
            <div className="build-info">
              <h1 className="title">Ocean Blue Premium Aquarium</h1>
              <p className="subtitle">Freshwater Planted Aquarium</p>
              <div className="iconText">
                <FaWater className="icon" />
                <span>100L Capacity</span>
              </div>
              <div className="iconText">
                <FaFish className="icon" />
                <span>Tropical Community Setup</span>
              </div>
              <p className="description">
                Professional aquarium setup with advanced filtration system, LED lighting, and diverse tropical fish
                community. Regular maintenance required for optimal fish health and water quality.
              </p>
            </div>
          </div>
          <HorizontalLine />
          <div className="product">
            <h2 className="sectionTitle">Sản phẩm</h2>
            <div className="productContainer">
              {products.map((product) => (
                <div key={product.id} className="productCard">
                  <img src={product.image} alt={product.name} className="productImage" />
                  <h3 className="productName">{product.name}</h3>
                  <p className="productDescription">{product.description}</p>
                  <p className="productPrice">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="service">
            <h2 className="sectionTitle">Chọn loại dịch vụ</h2>
            <div className="serviceGrid">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`serviceButton ${selectedServices.includes(service.id) ? "selected" : "unselected"}`}
                >
                  <div className="service-name">{service.name}</div>
                  <div className="service-price">${service.price}</div>
                </button>
              ))}
            </div>
          </div>

          <InfoWrapper>
            <BookingContainer>
              <BookingInfo />
            </BookingContainer>
            <CalendarContainer>
              <h2 className="sectionTitle">Chọn ngày</h2>
              {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
              <DateCalendar
                dayOfWeekFormatter={(day) => {
                  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
                  return weekdays[dayjs(day, "dd").day()];
                }}
              />
            </LocalizationProvider> */}
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <DateCalendar
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
          {/* <button
            disabled={
              !selectedDate ||
              !selectedTime ||
              selectedServices.length === 0 ||
              !customerInfo.fullName ||
              !customerInfo.phone
            }
            className={`bookButton ${
              selectedDate && selectedTime && selectedServices.length > 0 && customerInfo.fullName && customerInfo.phone
                ? "enabled"
                : "disabled"
            }`}
          >
            Book Maintenance
          </button> */}
        </div>
      </Container>
    </BookingServiceStyle>
  );
};

export default BookingService;
