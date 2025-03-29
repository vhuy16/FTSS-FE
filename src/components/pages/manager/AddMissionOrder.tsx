import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { Modal } from '@ui/modal';
import { useModal } from '@hooks/useModal';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import {
    assignBooking,
    assignBookingOrder,
    getAllBooking,
    getAllMission,
    getAlltechnician,
} from '@redux/slices/missionSlide';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    orderId: string | null;
};

interface CalendarEvent extends Mission {
    extendedProps: {
        calendar: string;
    };
}

const AddMissionOrder: React.FC = () => {
    const dispatch = useAppDispatch();
    const listMission = useAppSelector((state) => state.mission.listMission);
    const listTech = useAppSelector((state) => state.mission.listTechnician);
    const isLoadingAssignBooking = useAppSelector((state) => state.mission.isLoadingAssignBooking);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventLevel, setEventLevel] = useState('');
    const [des, setDes] = useState('');
    const [tech, setTech] = useState('');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const calendarRef = useRef<FullCalendar>(null);
    const { isOpen, openModal, closeModal } = useModal();
    const [data, setData] = useState({
        orderId: '',
        technicianId: '',
        missionName: '',
        missionDescription: '',
    });
    const isLoading = useAppSelector((state) => state.mission.isLoadingGetAllMission);
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();

    const calendarsEvents: { [key: string]: string } = {
        Cancel: 'danger',
        Done: 'success',
        NotStarted: 'primary',
        Processing: 'warning',
    };

    useEffect(() => {
        dispatch(getAllMission());
    }, []);
    useEffect(() => {
        const data = {
            scheduleDate: eventStartDate,
        };
        dispatch(getAlltechnician(data));
    }, [eventStartDate]);
    useEffect(() => {
        const newListMission = listMission?.map((mission) => {
            return {
                ...mission,
                title: mission.missionName,
                start: mission.missionSchedule,
                allDay: true,
                extendedProps: {
                    calendar: mission.status,
                    des: mission.missionDescription,
                    tech: mission.technicianName,
                },
            };
        });
        setEvents(newListMission);
    }, [listMission]);
    const handleDateSelect = (selectInfo: DateSelectArg) => {
        resetModalFields();
        setEventStartDate(selectInfo.startStr);
        openModal();
    };
    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        setSelectedEvent(event as unknown as CalendarEvent);
        setEventTitle(event.title);
        setDes(event.extendedProps.des);
        setTech(event.extendedProps.tech);
        setEventLevel(event.extendedProps.calendar);
        setEventStartDate(event.start ? format(event.start, 'yyyy-MM-dd') : '');
        openModal();
    };

    const handleAddEvent = async () => {
        const newEvent = {
            orderId: orderId,
            technicianId: data.technicianId,
            missionName: data.missionName,
            missionDescription: data.missionDescription,
            missionSchedule: eventStartDate,
        };
        try {
            const res = await dispatch(assignBookingOrder(newEvent)).unwrap();
            if (res.status == '201') {
                navigate('/calendar');
                toast.success('Giao nhiệm vụ cho nhân viên thành công');
                closeModal();
                resetModalFields();
            } else {
                toast.error('Không thể giao công việc');
            }
        } catch (error) {
            toast.error(error as string);
        }
    };
    const resetModalFields = () => {
        setData({ orderId: '', technicianId: '', missionName: '', missionDescription: '' });
        setSelectedEvent(null);
    };
    const renderEventContent = (eventInfo: any) => {
        const colorClass = `fc-bg-${calendarsEvents[eventInfo.event.extendedProps.calendar]}`;
        return (
            <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded`}>
                <div className="fc-daygrid-event-dot flex-shrink-0"></div>
                <div className="fc-event-time">{eventInfo.timeText}</div>
                <div className="fc-event-title whitespace-normal break-words">{eventInfo.event.title}</div>
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
                        left: 'prev,next addEventButton',
                        center: 'title',
                        right: 'dayGridMonth',
                    }}
                    events={events}
                    selectable={true}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    eventContent={renderEventContent}
                    customButtons={{
                        addEventButton: {
                            text: 'Tạo mới +',
                            click: openModal,
                        },
                    }}
                />
            </div>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    resetModalFields();
                    closeModal();
                }}
                className="max-w-[700px] p-6 lg:p-10"
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
                                    value={selectedEvent ? eventTitle : data.missionName}
                                    onChange={(e) => setData({ ...data, missionName: e.target.value })}
                                    placeholder="Viết tiêu đề của công việc tại đây"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                        </div>
                        {selectedEvent && (
                            <div className="mt-6">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Nhân viên
                                    </label>
                                    <input
                                        id="event-title"
                                        type="text"
                                        value={tech}
                                        placeholder="Viết mô tả của công việc tại đây"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    />
                                </div>
                            </div>
                        )}
                        {!selectedEvent && (
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
                                        onChange={(e) =>
                                            setData({ ...data, technicianId: JSON.parse(e.target.value).id })
                                        }
                                    >
                                        <option selected value={JSON.stringify({ name: 'Chọn nhân viên', id: '1' })}>
                                            Chọn nhân viên...
                                        </option>
                                        {listTech?.map((tech) => (
                                            <option value={JSON.stringify({ name: tech.fullName, id: tech.techId })}>
                                                {tech.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

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
                                    value={selectedEvent ? des : data.missionDescription}
                                    onChange={(e) => setData({ ...data, missionDescription: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                                Trạng thái
                            </label>
                            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
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
                                                        checked={
                                                            selectedEvent
                                                                ? eventLevel === key
                                                                : key == 'NotStarted'
                                                                ? true
                                                                : false
                                                        }
                                                        disabled={eventLevel !== key && eventLevel !== ''}
                                                        onChange={() => setEventLevel(key)}
                                                    />
                                                    <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                                                        <span className="w-2 h-2 bg-white rounded-full dark:bg-transparent"></span>
                                                    </span>
                                                </span>
                                                {key === 'Cancel'
                                                    ? 'Đã hủy'
                                                    : key === 'Done'
                                                    ? 'Hoàn tất'
                                                    : key === 'NotStarted'
                                                    ? 'Chưa bắt đầu'
                                                    : 'Đang thực hiện'}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Ngày làm
                            </label>
                            <div className="relative">
                                <input
                                    id="event-start-date"
                                    type="date"
                                    value={eventStartDate}
                                    onChange={(e) => setEventStartDate(e.target.value)}
                                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>
                    </div>
                    {!selectedEvent && (
                        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-center">
                            <button
                                onClick={handleAddEvent}
                                type="button"
                                className="text-white inline-flex items-center bg-blackGreen  hover:bg-blackGreenHover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-3 mr-3"
                            >
                                {isLoadingAssignBooking ? <Loading></Loading> : 'Thêm'}
                            </button>
                            <button
                                onClick={closeModal}
                                type="button"
                                className="text-red-600 inline-flex items-center mt-3 font-bold text-sm underline"
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default AddMissionOrder;
