import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllCategory, getAllSubCategoryByCateName } from "@redux/slices/categorySlice";
import { addProducts, editProducts, Product } from "@redux/slices/productSlice";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";
import { Checkbox, FormControlLabel } from "@mui/material";
import { tab } from "@testing-library/user-event/dist/tab";
import { FiCalendar, FiX } from "react-icons/fi";
import { Input } from "@styles/form";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import styled from "styled-components";
import { getAllDistrict, getAllProvince, getAllWard } from "@redux/slices/addressSlice";
import { BookingContainer, CalendarContainer, InfoWrapper } from "@components/pages/Booking/BookingServiceStyle";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { BookingDetail, getAllUnavailableDates, updateBookingSchedule } from "@redux/slices/bookingSlice";
import { useNavigate } from "react-router-dom";
interface ModalUpdateProps {
  isModalUpdateOpen: boolean;
  onClose: () => void;
  booking: BookingDetail | null;
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1100,
};
const BillingOrderWrapper = styled.div`
  gap: 60px;

  @media (max-width: ${breakpoints.xl}) {
    gap: 40px;
  }
  @media (max-width: ${breakpoints.lg}) {
    gap: 30px;
    grid-template-columns: 100%;
  }
`;

const BillingDetailsWrapper = styled.div`
  @media (max-width: ${breakpoints.lg}) {
    order: 2;
  }

  .checkout-form {
    margin-top: 24px;

    .input-elem {
      margin-bottom: 16px;

      @media (max-width: ${breakpoints.xs}) {
        margin-bottom: 10px;
      }

      label {
        margin-bottom: 8px;
        display: block;
      }

      input,
      select {
        height: 45px;
        border-radius: 4px;
        /* background: ${defaultTheme.color_whitesmoke}; */
        padding-left: 12px;
        padding-right: 12px;
        width: 100%;
        border: 1px solid ${defaultTheme.color_platinum};
        font-size: 12px;

        &::placeholder {
          font-size: 12px;
        }
      }
    }

    .elem-col-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 24px;

      @media (max-width: ${breakpoints.lg}) {
        column-gap: 12px;
      }
      @media (max-width: ${breakpoints.sm}) {
        grid-template-columns: 100%;
      }
    }

    .elem-col-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 24px;

      @media (max-width: ${breakpoints.lg}) {
        column-gap: 12px;
      }
      @media (max-width: ${breakpoints.sm}) {
        grid-template-columns: 100%;
      }
    }

    .input-check-group {
      column-gap: 10px;
      margin-top: 16px;
    }
    .contd-delivery-btn {
      margin-top: 20px;

      @media (max-width: ${breakpoints.sm}) {
        width: 100%;
      }
    }
  }
`;
export default function UpdateBookingModal({ isModalUpdateOpen, onClose, booking }: ModalUpdateProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const listProvince = useAppSelector((state) => state.address.listProvince);
  const listDistrict = useAppSelector((state) => state.address.listDistrict);
  const listWard = useAppSelector((state) => state.address.listWard);
  const [idProvice, setIdProvince] = useState({ id: "700000", name: "Hồ Chí Minh" });
  const [district, setDistrict] = useState({ id: "0", name: "", city_id: "" });
  const [ward, setWard] = useState({ id: "0", name: "" });
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const unavailableDates = useAppSelector((state) => state.bookingService.unavailableDates);
  const [disabledDates, setDisabledDates] = useState<Dayjs[]>([]);
  const isLoadingUpdate = useAppSelector((state) => state.bookingService.isLoadingUpdate);
  useEffect(() => {
    dispatch(getAllProvince());
    if (idProvice.id != "0") {
      dispatch(getAllDistrict(idProvice.id));
    }
    if (district.id != "0") {
      dispatch(getAllWard(district.id));
    }
  }, [idProvice.id, district.id]);
  useEffect(() => {
    dispatch(getAllUnavailableDates());
  }, [dispatch]);
  useEffect(() => {
    if (unavailableDates.length > 0) {
      const formattedDates = unavailableDates.map((item) => dayjs(item.scheduleDate));
      setDisabledDates(formattedDates);
    }
  }, [unavailableDates]);
  useEffect(() => {
    if (booking) {
      setFormValue((prev) => ({
        ...prev,
        customer_name: booking.fullName || "",
        phone: booking.phoneNumber || "",
      }));
    }
  }, [booking, isModalUpdateOpen]);
  useEffect(() => {
    if (booking?.scheduleDate) {
      setSelectedDate(dayjs(booking.scheduleDate));
    }
  }, [booking]);

  const initFormValue = {
    phone: "",
    customer_name: "",
    street: "",
    district: "",
    province: "Hồ Chí Minh",
    ward: "",
    Address: "",
  };
  const [formValue, setFormValue] = useState(initFormValue);
  const [formError, setFormError] = useState({
    name: "",
    phone: "",
    street: "",
    province: "",
    district: "",
    address: "",
    ward: "",
  });
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const formattedDate = selectedDate?.format("YYYY-MM-DD");

  const handleSave = async () => {
    if (
      !selectedDate ||
      !formValue.customer_name ||
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
      const address = `${formValue.street}, ${formValue.ward}, ${formValue.district}, ${formValue.province}`;

      const formData = new FormData();

      formData.append("Address", address || "");
      formData.append("PhoneNumber", formValue.phone || "");
      formData.append("FullName", formValue.customer_name || "");
      formData.append("ScheduleDate", formattedDate || "");
      if (!booking?.id) {
        toast.error("Không tìm thấy ID của đơn đặt lịch.");
        return;
      }
      const response = await dispatch(updateBookingSchedule({ formData, id: booking?.id }));

      if (response?.payload?.status === "200" || response?.payload?.status === "201") {
        toast.success("Cập nhật lịch bảo trì thành công");
        handleCloseModal();
      } else {
        toast.error(response?.payload || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch bảo trì:", error);
      toast.error("Lưu thất bại, vui lòng thử lại.");
    }
  };
  const handleCloseModal = () => {
    setFormValue(initFormValue);
    setFormError({
      name: "",
      phone: "",
      street: "",
      province: "",
      district: "",
      address: "",
      ward: "",
    });
    setIdProvince({ id: "700000", name: "Hồ Chí Minh" });
    setDistrict({ id: "0", name: "", city_id: "" });
    setWard({ id: "0", name: "" });
    setSelectedDate(null);
    onClose();
  };
  return (
    <>
      {/* Modal */}
      <div>
        <Modal
          open={isModalUpdateOpen}
          onClose={handleCloseModal}
          disableEnforceFocus
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl max-h-[190vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Cập nhật thông tin</h2>
                    <button className="text-gray-500 hover:text-gray-700">
                      <FiX size={24} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <InfoWrapper>
                    <BookingContainer>
                      <BillingOrderWrapper className="billing-and-order grid items-start">
                        <BillingDetailsWrapper>
                          <h4 className="text-xxl font-bold text-outerspace">Thông tin người nhận hàng</h4>
                          <div className="checkout-form">
                            <div className="input-elem-group elem-col-2">
                              <div className="input-elem">
                                <label htmlFor="" className="text-base text-outerspace font-semibold">
                                  Tên*
                                </label>
                                <Input
                                  type="text"
                                  placeholder="Tên"
                                  value={formValue.customer_name}
                                  onChange={(e) => setFormValue({ ...formValue, customer_name: e.target.value })}
                                />
                                {formError.name && <div className="text-red text-sm">{formError.name}</div>}
                              </div>
                              <div className="input-elem">
                                <label htmlFor="" className="text-base text-outerspace font-semibold">
                                  SĐT*
                                </label>
                                <Input
                                  type="text"
                                  placeholder="SĐT"
                                  value={formValue.phone}
                                  onChange={(e) => setFormValue({ ...formValue, phone: e.target.value })}
                                />
                                {formError.phone && <div className="text-red text-sm">{formError.phone}</div>}
                              </div>
                            </div>

                            <div>
                              <div className="input-elem-group elem-col-3">
                                <div className="input-elem">
                                  <label htmlFor="" className="text-base text-outerspace font-semibold">
                                    Tỉnh*
                                  </label>
                                  <select
                                    id="Tinh"
                                    value={JSON.stringify(idProvice)}
                                    onChange={(e) => {
                                      const selectedProvince = JSON.parse(e.target.value);
                                      setIdProvince(selectedProvince);
                                      setFormValue((prev) => ({
                                        ...prev,
                                        province: selectedProvince.name,
                                      }));
                                    }}
                                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  >
                                    <option value={JSON.stringify(idProvice)}>{idProvice.name}</option>
                                  </select>
                                  {formError.province && <div className="text-red text-sm">{formError.province}</div>}
                                </div>
                                <div className="input-elem">
                                  <label htmlFor="" className="text-base text-outerspace font-semibold">
                                    Huyện/Thành phố*
                                  </label>
                                  <select
                                    id="huyen"
                                    value={JSON.stringify(district)}
                                    onChange={(e) => {
                                      setDistrict(JSON.parse(e.target.value));
                                      setFormValue({ ...formValue, district: JSON.parse(e.target.value).name });
                                    }}
                                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  >
                                    <option
                                      value={JSON.stringify({
                                        id: "",
                                        name: "",
                                      })}
                                    >
                                      Chọn huyện ...
                                    </option>
                                    {listDistrict.map((district, index) => {
                                      return (
                                        <option
                                          key={index}
                                          value={JSON.stringify({
                                            id: district.id,
                                            name: district.name,
                                            city_id: district.city_id,
                                          })}
                                        >
                                          {district.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  {formError.district && <div className="text-red text-sm">{formError.district}</div>}
                                </div>
                                <div className="input-elem">
                                  <label htmlFor="" className="text-base text-outerspace font-semibold">
                                    Phường/Xã*
                                  </label>
                                  <select
                                    id="Phuong"
                                    value={JSON.stringify(ward)}
                                    onChange={(e) => {
                                      setWard(JSON.parse(e.target.value));
                                      setFormValue({ ...formValue, ward: JSON.parse(e.target.value).name });
                                    }}
                                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  >
                                    <option
                                      value={JSON.stringify({
                                        id: "",
                                        name: "",
                                      })}
                                    >
                                      Chọn phường ...
                                    </option>
                                    {listWard.map((ward, index) => {
                                      return (
                                        <option
                                          key={index}
                                          value={JSON.stringify({
                                            id: ward.id,
                                            name: ward.name,
                                          })}
                                        >
                                          {ward.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  {formError.ward && <div className="text-red text-sm">{formError.ward}</div>}
                                </div>
                              </div>
                              <div className="input-elem-group elem-col-1">
                                <div className="input-elem">
                                  <label htmlFor="" className="text-base text-outerspace font-semibold">
                                    Số nhà, tên đường*
                                  </label>
                                  <Input
                                    type="text"
                                    placeholder="Đường"
                                    value={formValue.street}
                                    onChange={(e) => setFormValue({ ...formValue, street: e.target.value })}
                                  />
                                  {formError.street && <div className="text-red text-sm">{formError.street}</div>}
                                </div>
                              </div>
                            </div>
                            <div className="horiz-line-separator w-full"></div>
                          </div>
                        </BillingDetailsWrapper>
                      </BillingOrderWrapper>
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
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center`}
                    >
                      {isLoadingUpdate ? <Loading /> : "Cập nhật"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
}
