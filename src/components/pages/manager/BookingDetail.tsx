import React, { useEffect } from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getOrderById } from '@redux/slices/orderSlice';
import Loading from '@components/atom/Loading/Loading';
import { currencyFormat } from '@ultils/helper';
import { getBookingById } from '@redux/slices/missionSlide';

export default function BookingDetail() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const bookingDetail = useAppSelector((state) => state.mission.booking);
    const isLoading = useAppSelector((state) => state.mission.isLoading);
    useEffect(() => {
        dispatch(getBookingById(id as string));
    }, [id]);
    return (
        <>
            <PageBreadcrumb pageTitle="Thông tin đơn bảo trì" />
            {isLoading ? (
                <Loading></Loading>
            ) : bookingDetail ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                    <div className="space-y-6">
                        <div className="2xl:container pb-14">
                            <div className="flex justify-start item-start space-y-2 flex-col">
                                <h1 className="text-xl dark:text-white lg:text-xl font-semibold leading-7 lg:leading-9 text-gray-800">
                                    Đơn {bookingDetail.bookingCode}
                                </h1>
                                <p className="text-base text-gray-600 font-medium leading-6">
                                    Trạng thái:{' '}
                                    {bookingDetail.missionStatus === 'Done'
                                        ? 'Hoàn tất'
                                        : bookingDetail.missionStatus === 'Cancel'
                                        ? 'Đã hủy'
                                        : bookingDetail.missionStatus === 'Processing'
                                        ? 'Đang tiến hành'
                                        : 'Chưa bắt đầu'}
                                </p>
                                <p className="text-base text-gray-600 font-medium leading-6">
                                    Trạng thái phân công:{' '}
                                    {bookingDetail.isAssigned === true ? 'Đã được phân công' : 'Chưa phân công'}
                                </p>
                                <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
                                    Ngày bảo trì: {bookingDetail.scheduleDate.split('T')[0]}
                                </p>
                                <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
                                    Địa chỉ bảo trì: {bookingDetail.address}
                                </p>
                            </div>
                            <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                                    <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                                        <p className="text-lg md:text-2xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800 mb-4">
                                            Dịch vụ
                                        </p>
                                        {bookingDetail.services.map((service) => (
                                            <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                                                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                                                        <h3 className="text-xl dark:text-white font-semibold leading-6 text-gray-800">
                                                            {service.serviceName}
                                                        </h3>
                                                    </div>
                                                    <div className="flex justify-between space-x-8 items-start w-full">
                                                        <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
                                                            {currencyFormat(service.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                                                Chi tiết thanh toán
                                            </h3>
                                            <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                                <div className="flex justify-between w-full">
                                                    <p className="text-base dark:text-white leading-4 text-gray-800">
                                                        Tổng phụ
                                                    </p>
                                                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                        {currencyFormat(bookingDetail.totalPrice)}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center w-full">
                                                    <p className="text-base dark:text-white leading-4 text-gray-800">
                                                        Giảm giá{' '}
                                                    </p>
                                                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                        -₫0 (0%)
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center w-full">
                                                <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                                                    Tổng
                                                </p>
                                                <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                                                    {currencyFormat(bookingDetail.totalPrice)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                                                Thanh toán
                                            </h3>
                                            <div className="flex justify-between items-start w-full">
                                                <div className="flex items-center w-full space-y-4 flex-col  pb-4">
                                                    <div className="flex justify-between w-full">
                                                        <p className="text-base dark:text-white leading-4 text-gray-800">
                                                            Phương thức thanh toán
                                                        </p>
                                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                            VnPay
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <p className="text-base dark:text-white leading-4 text-gray-800">
                                                            Trạng thái
                                                        </p>
                                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                            {bookingDetail.status == 'NOTPAID'
                                                                ? 'Chưa thanh toán'
                                                                : bookingDetail.status == 'PAID'
                                                                ? 'Đã thanh toán'
                                                                : bookingDetail.status == 'FREE'
                                                                ? 'Có gói bảo trì'
                                                                : bookingDetail.status == 'REFUNDING'
                                                                ? 'Đang hoàn tiền'
                                                                : 'Đã hoàn tiền'}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                                    {/* <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                                        Khách hàng {bookingDetail.userResponse.name}
                                    </h3> */}
                                    <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                                        {/* <div className="flex flex-col justify-start items-start flex-shrink-0">
                                            <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                                                        stroke="currentColor"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                    <path
                                                        d="M3 7L12 13L21 7"
                                                        stroke="currentColor"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                                <p className="cursor-pointer text-sm leading-5 ">
                                                    {bookingDetail.userResponse.email}
                                                </p>
                                            </div>
                                        </div> */}
                                        <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                                            <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                                                <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                                    <div className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                                        Thông tin khách hàng
                                                    </div>
                                                    <div className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                                        <div>Tên: {bookingDetail.fullName}</div>
                                                        <div>SĐT: {bookingDetail.phoneNumber}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
