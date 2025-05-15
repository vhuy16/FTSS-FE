import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllUnavailableDates } from "@redux/slices/bookingSlice";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

type FormScheduleProps = {
  setSelectedSchedule: (value: string) => void;
  dateSchedule?: string;
};
const FormSchedule = ({ setSelectedSchedule, dateSchedule }: FormScheduleProps) => {
  const dispatch = useAppDispatch();
  //select date time
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const dateUnvailable = useAppSelector((state) => state.bookingService.unavailableDates);

  // ngay băts day tu tu ngay hom sau cua hien taitai
  const generateWeekDays = (): Dayjs[] => {
    const days: Dayjs[] = [];
    for (let i = 0; i < 10; i++) {
      days.push(dayjs().add(i, "day"));
    }
    return days;
  };
  //gioi han thoi gian tu 7h den 17h va cach nhau 30 phut
  const generateAllTimeSlots = (): string[] => {
    const slots: string[] = [];
    let current = dayjs().hour(7).minute(0).second(0);
    const end = dayjs().hour(17).minute(0).second(0);

    while (current.isBefore(end) || current.isSame(end)) {
      slots.push(current.format("HH:mm"));
      current = current.add(30, "minute");
    }

    return slots;
  };

  const allTimeSlots = generateAllTimeSlots();

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setSelectedTime(null); // reset time when new date selected
  };

  const handleTimeSelect = (time: any) => {
    setSelectedTime(time);
  };
  //format lại ngày gửi
  const getSendTimeString = () => {
    if (!selectedDate || !selectedTime) return "";

    const [hour, minute] = selectedTime.split(":").map(Number);
    const fullDateTime = selectedDate.hour(hour).minute(minute).second(0);

    return fullDateTime.format("YYYY-MM-DDTHH:mm:ss");
  };
  useEffect(() => {
    if (dateSchedule) {
      dispatch(getAllUnavailableDates(dateSchedule));
    } else {
      dispatch(getAllUnavailableDates());
    }
  }, [dispatch]);

  useEffect(() => {
    const sendTime = getSendTimeString();
    setSelectedSchedule(sendTime);
  }, [selectedDate, selectedTime]);

  return (
    <div className="items-start">
      <h1 className="text-gray-800 text-xl font-bold mb-5">Thời gian lắp đặt</h1>
      {/* Day Selector */}
      <div className="overflow-x-auto pb-4 mb-8">
        <div className="flex space-x-6">
          {generateWeekDays().map((date) => {
            const isUnavailable = dateUnvailable.some((d) => dayjs(d.scheduleDate).isSame(date, "day"));

            return (
              <button
                key={date.format("YYYY-MM-DD")}
                onClick={() => !isUnavailable && handleDateSelect(date)}
                disabled={isUnavailable}
                className={`flex flex-col items-center justify-center min-w-[70px] h-[100px] rounded-full p-4 transition-all duration-300 ${
                  isUnavailable
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : selectedDate.isSame(date, "day")
                    ? "bg-[#6C63FF] text-white"
                    : "bg-white border border-gray-200 text-[#3A3A3A] hover:bg-gray-50"
                }`}
                aria-label={`Chọn ngày ${date.format("dddd, MMMM D")}`}
              >
                <span className="text-sm font-bold">{date.format("ddd").toUpperCase()}</span>
                <span className="text-sm font-medium">{date.format("D")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="max-h-[430px] overflow-y-auto pr-1 scrollbar-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {allTimeSlots.map((time) => {
            const [hour, minute] = time.split(":").map(Number);
            const slotTime = selectedDate.hour(hour).minute(minute).second(0);

            const isToday = selectedDate.isSame(dayjs(), "day");
            const isPastTimeToday = isToday && slotTime.isBefore(dayjs());

            // Không cho đặt trong vòng 3 tiếng tính từ thời điểm hiện tại
            const isTooSoon = slotTime.isBefore(dayjs().add(2, "hour"));
            const isDisabled = isPastTimeToday || isTooSoon;

            return (
              <button
                key={time}
                onClick={() => !isDisabled && handleTimeSelect(time)}
                disabled={isDisabled}
                className={`h-[50px] rounded-full px-1 transition-all duration-300 ${
                  isDisabled
                    ? "bg-gray-200 text-gray-500 opacity-50 cursor-not-allowed"
                    : selectedTime === time
                    ? "bg-[#6C63FF] text-white"
                    : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-100"
                }`}
                aria-label={`Chọn giờ ${time}`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default FormSchedule;
