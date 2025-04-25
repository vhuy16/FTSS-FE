import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { Modal } from '@ui/modal';
import { useModal } from '@hooks/useModal';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllBooking, getAllMission, getAlltechnician, ImageItem, updateMission } from '@redux/slices/missionSlide';
import { toast } from 'react-toastify';
import Loading from '@components/atom/Loading/Loading';
import LoadingPage from '@components/atom/Loading/LoadingPage';
type Mission = {
    id: string;
    missionName: string;
    missionDescription: string;
    status: string;
    missionSchedule: string;
    address: string | null;
    phoneNumber: string | null;
    technicianId: string;
    technicianName: string;
    bookingId: string | null;
    bookingCode: string | null;
    orderCode: string | null;
};

interface CalendarEvent extends Mission {
    extendedProps: {
        calendar: string;
    };
}

const Calendar: React.FC = () => {
    const dispatch = useAppDispatch();
    const listMission = useAppSelector((state) => state.mission.listMission);
    const listTech = useAppSelector((state) => state.mission.listTechnician);
    const isLoading = useAppSelector((state) => state.mission.isLoadingGetAllMission);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [eventLevel, setEventLevel] = useState('');
    const [orderId, setOrderId] = useState('');
    const [orderCode, setOrderCode] = useState('');
    const [missionId, setMissionId] = useState('');
    const [techName, setTechName] = useState('');
    const [bookingCode, setBookingCode] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [images, setImages] = useState<ImageItem[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const calendarRef = useRef<FullCalendar>(null);
    const { isOpen, openModal, closeModal } = useModal();
    const [data, setData] = useState({ bookingId: '', technicianId: '', missionName: '', missionDescription: '' });

    const isLoadingUpdate = useAppSelector((state) => state.mission.isLoadingUpdate);

    const calendarsEvents: { [key: string]: string } = {
        Cancel: 'danger',
        NotStarted: 'primary',
        Processing: 'warning',
        NotDone: 'notDone',
        Done: 'completed',
        Reported: 'reported',
        Completed: 'success',
    };

    useEffect(() => {
        dispatch(getAllMission());
    }, []);
    useEffect(() => {
        if (isOpen) {
            const data = {
                scheduleDate: eventStartDate,
            };
            dispatch(getAlltechnician(data));
        }
    }, [eventStartDate]);
    useEffect(() => {
        const newListMission = listMission?.map((mission) => {
            return {
                ...mission,
                title: mission.missionName,
                start: mission.missionSchedule,
                end: mission.endMissionSchedule,
                extendedProps: {
                    calendar: mission.status,
                    des: mission.missionDescription,
                    tech: mission.technicianId,
                    bookingId: mission.bookingId,
                    bookingCode: mission.bookingCode,
                    techName: mission.technicianName,
                    orderId: mission.orderId,
                    orderCode: mission.orderCode,
                    missionId: mission.id,
                    cancelReason: mission.cancelReason,
                    images: mission.images,
                },
            };
        });
        setEvents(newListMission);
    }, [listMission]);

    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        setSelectedEvent(event as unknown as CalendarEvent);
        setEventTitle(event.title);
        const formatDateTimeLocal = (date: Date | null): string => {
            if (!date) return '';
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - offset * 60 * 1000);
            return localDate.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
        };

        setEventStartDate(formatDateTimeLocal(event.start));
        setEventEndDate(formatDateTimeLocal(event.end));
        setEventLevel(event.extendedProps.calendar);
        setTechName(event.extendedProps.techName);
        setOrderId(event.extendedProps.orderId);
        setOrderCode(event.extendedProps.orderCode);
        setBookingCode(event.extendedProps.bookingCode);
        setOrderId(event.extendedProps.orderId);
        setMissionId(event.extendedProps.missionId);
        setCancelReason(event.extendedProps.cancelReason);
        setImages(event.extendedProps.images);
        setData({
            missionName: event.title,
            missionDescription: event.extendedProps.des,
            technicianId: event.extendedProps.tech,
            bookingId: event.extendedProps.bookingId,
        });

        openModal();
    };

    const handleUpdateEvent = async () => {
        const formData = new FormData();
        formData.append('MissionName', data.missionName);
        formData.append('MissionDescription', data.missionDescription);
        formData.append('TechnicianId', data.technicianId);
        formData.append('Status', eventLevel);
        if (
            eventLevel === 'Cancel' ||
            eventLevel === 'NotDone' ||
            eventLevel === 'Completed' ||
            eventLevel === 'Reported'
        ) {
            try {
                const res = await dispatch(updateMission({ formData: formData, id: missionId })).unwrap();
                if (res.status == '200') {
                    toast.success('Cập nhật công việc thành công');
                    closeModal();
                    resetModalFields();
                } else {
                    toast.error('Cập nhật công việc không thành công');
                }
            } catch (error) {
                toast.error(error as string);
            }
        } else {
            toast.error('Manager chỉ được cập nhật các trạng thái được cho phép');
        }
    };

    const resetModalFields = () => {
        setData({ bookingId: '', technicianId: '', missionName: '', missionDescription: '' });
        setSelectedEvent(null);
        setCancelReason('');
    };
    const renderEventContent = (eventInfo: any) => {
        const colorClass = `fc-bg-${calendarsEvents[eventInfo.event.extendedProps.calendar]}`;
        const start = eventInfo.event.start;
        const end = eventInfo.event.end;

        // Format thời gian (ví dụ: 9:30a - 11:00a)
        const formatTime = (date: Date) =>
            date
                .toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                })
                .toLowerCase();

        const timeText = `${formatTime(start)}${end ? ' - ' + formatTime(end) : ''}`;
        return (
            <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded`}>
                <div className="fc-daygrid-event-dot flex-shrink-0"></div>

                <div className="flex flex-col overflow-hidden">
                    <div className="fc-event-time">{timeText}</div>
                    <div
                        className="fc-event-title overflow-hidden break-words whitespace-normal line-clamp-2"
                        title={eventInfo.event.title}
                    >
                        {eventInfo.event.title}
                    </div>
                    {eventInfo.event.extendedProps.orderCode === 'Không có' ? (
                        <div className="fc-event-title overflow-hidden break-words whitespace-normal line-clamp-2">
                            {eventInfo.event.extendedProps.bookingCode}
                        </div>
                    ) : (
                        <div className="fc-event-title overflow-hidden break-words whitespace-normal line-clamp-2">
                            {eventInfo.event.extendedProps.orderCode}
                        </div>
                    )}
                </div>
            </div>
        );
    };
    return isLoading && listMission.length == 0 ? (
        <LoadingPage></LoadingPage>
    ) : (
        <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="custom-calendar">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    events={events}
                    selectable={true}
                    eventClick={handleEventClick}
                    eventContent={renderEventContent}
                />
            </div>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    resetModalFields();
                    closeModal();
                }}
                className="max-w-[700px] max-h-[930px] p-6 lg:p-10 overflow-y-auto"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                            {selectedEvent ? 'Chi tiết công việc' : 'Thêm công việc'}
                        </h5>
                    </div>
                    <div className="mt-8">
                        <div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                    Tiêu đề
                                </label>
                                <input
                                    id="event-title"
                                    type="text"
                                    value={data.missionName}
                                    onChange={(e) => setData({ ...data, missionName: e.target.value })}
                                    placeholder="Viết tiêu đề của công việc tại đây"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <div className="w-full">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Chọn nhân viên
                                </label>
                                <select
                                    id="employee"
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
focus:ring-blue-500 focus:border-blue-500 p-2.5 
dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={(e) => setData({ ...data, technicianId: JSON.parse(e.target.value).id })}
                                >
                                    <option selected value={JSON.stringify({ name: techName, id: data.technicianId })}>
                                        {techName}
                                    </option>
                                    {listTech?.map((tech) => (
                                        <option value={JSON.stringify({ name: tech.fullName, id: tech.techId })}>
                                            {tech.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                >
                                    Mô tả
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Viết mô tả công việc tại đây"
                                    required={true}
                                    value={data.missionDescription}
                                    onChange={(e) => setData({ ...data, missionDescription: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                                Trạng thái
                            </label>
                            <div className="flex items-center gap-4 sm:gap-5">
                                {Object.entries(calendarsEvents).map(([key, value]) => (
                                    <div key={key} className="n-chk">
                                        <div className={`form-check form-check-${value} form-check-inline`}>
                                            <label
                                                className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                                                htmlFor={`modal${key}`}
                                            >
                                                <span className="relative">
                                                    <input
                                                        className="sr-only form-check-input"
                                                        type="radio"
                                                        name="event-level"
                                                        value={key}
                                                        id={`modal${key}`}
                                                        checked={eventLevel === key}
                                                        onChange={() => setEventLevel(key)}
                                                    />
                                                    <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                                                        <span className="w-2 h-2 bg-white rounded-full dark:bg-transparent"></span>
                                                    </span>
                                                </span>
                                                {key === 'Cancel'
                                                    ? 'Đã hủy'
                                                    : key === 'NotStarted'
                                                    ? 'Chưa bắt đầu'
                                                    : key === 'Done'
                                                    ? 'Xong công việc'
                                                    : key === 'Completed'
                                                    ? 'Hoàn tất'
                                                    : key === 'NotDone'
                                                    ? 'Chưa xong'
                                                    : key === 'Reported'
                                                    ? 'Báo cáo'
                                                    : 'Đang thực hiện'}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {eventLevel === 'Cancel' && cancelReason && (
                            <div className="mt-6">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Lý do hủy
                                    </label>
                                    <input
                                        id="event-title"
                                        type="text"
                                        value={cancelReason}
                                        placeholder="Viết tiêu đề của công việc tại đây"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    />
                                </div>
                            </div>
                        )}
                        {eventLevel === 'Cancel' && cancelReason && (
                            <div className="mt-6">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Tệp đính kèm
                                    </label>
                                    <div className="flex gap-2">
                                        {images.map((image) => {
                                            return (
                                                <img
                                                    className="h-32 w-20 rounded-lg object-cover"
                                                    src={image.linkImage}
                                                    alt="Ảnh sản phẩm lỗi"
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mt-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                    {data.bookingId ? 'Mã đơn bảo trì' : 'Mã đơn hàng'}
                                </label>
                                <input
                                    id="event-title"
                                    type="text"
                                    value={data.bookingId ? bookingCode : orderCode}
                                    placeholder="Viết tiêu đề của công việc tại đây"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Ngày bắt đầu
                            </label>
                            <div className="relative">
                                <input
                                    id="event-start-date"
                                    type="datetime-local"
                                    value={eventStartDate}
                                    // onChange={(e) => setEventStartDate(e.target.value)}
                                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Ngày kết thúc
                            </label>
                            <div className="relative">
                                <input
                                    id="event-start-date"
                                    type="datetime-local"
                                    value={eventEndDate}
                                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-center">
                        <button
                            onClick={handleUpdateEvent}
                            type="button"
                            className="text-white inline-flex items-center bg-blackGreen  hover:bg-blackGreenHover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-3 mr-3"
                        >
                            {isLoadingUpdate ? <Loading></Loading> : 'Lưu'}
                        </button>
                        <button
                            onClick={closeModal}
                            type="button"
                            className="text-red-600 inline-flex items-center mt-3 font-bold text-sm underline"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Calendar;
