import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@common/PageBreadCrumb';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getOrderById } from '@redux/slices/orderSlice';
import Loading from '@components/atom/Loading/Loading';
import { currencyFormat } from '@ultils/helper';

export default function OrderDetail() {
    type DetailOrder = {
        productName: string;
        price: number;
        quantity: number;
        linkImage: string;
        categoryName: string;
        subCategoryName: string;
    };
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const orderDetail = useAppSelector((state) => state.order.order);
    const isLoading = useAppSelector((state) => state.order.isLoading);
    const [isOpen, setIsOpen] = useState(false);
    const total = orderDetail?.orderDetails.reduce((total: number, item: DetailOrder) => {
        return total + item.price * item.quantity;
    }, 0);

    useEffect(() => {
        dispatch(getOrderById(id as string));
    }, [id]);
    return (
        <>
            <PageBreadcrumb pageTitle="Thông tin đơn hàng" />
            {isLoading ? (
                <Loading></Loading>
            ) : orderDetail ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                    <div className="space-y-6">
                        <div className="2xl:container pb-14">
                            <div className="flex justify-start item-start space-y-2 flex-col">
                                <h1 className="text-xl dark:text-white lg:text-xl font-semibold leading-7 lg:leading-9 text-gray-800">
                                    Đơn hàng {orderDetail.oderCode}
                                </h1>
                                <p className="text-base text-gray-600 font-medium leading-6">
                                    Trạng thái:{' '}
                                    {orderDetail.status === 'PENDING_DELIVERY'
                                        ? 'Đang giao'
                                        : orderDetail.status === 'PROCESSING'
                                        ? 'Đang xử lý'
                                        : orderDetail.status === 'PROCESSED'
                                        ? 'Đã xử lý'
                                        : orderDetail.status === 'CANCELLED'
                                        ? 'Đã hủy'
                                        : orderDetail.status === 'COMPLETED'
                                        ? 'Hoàn tất'
                                        : orderDetail.status === 'DONE'
                                        ? 'Xong công việc'
                                        : orderDetail.status === 'NOTDONE'
                                        ? 'Chưa xong'
                                        : orderDetail.status === 'RETURNING'
                                        ? 'Yêu cầu hoàn trả'
                                        : orderDetail.status === 'RETURNED'
                                        ? 'Đã hoàn trả'
                                        : orderDetail.status === 'RETURN_ACCEPTED'
                                        ? 'Đã chấp nhận hoàn trả'
                                        : 'error'}
                                </p>
                                <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
                                    Ngày đặt: {orderDetail.createDate.split('T')[0]}
                                </p>
                                {orderDetail?.installationDate && (
                                    <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
                                        Ngày giao: {orderDetail?.installationDate?.split('T')[0]} lúc{' '}
                                        {orderDetail?.installationDate?.split('T')[1].split(':').slice(0, 2).join(':')}
                                    </p>
                                )}
                            </div>
                            <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                                    <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                                        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                                            Sản phẩm
                                        </p>
                                        {orderDetail.orderDetails.map((product) => (
                                            <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                                <div className="pb-4 md:pb-8 w-full md:w-40">
                                                    <img className="w-full " src={product.linkImage} alt="product" />
                                                </div>
                                                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                                                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                                                        <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
                                                            {product.productName}
                                                        </h3>
                                                        <div className="flex justify-start items-start flex-col space-y-2">
                                                            <p className="text-sm dark:text-white leading-none text-gray-800">
                                                                <span className="dark:text-gray-400 text-gray-400">
                                                                    Danh mục:{' '}
                                                                </span>
                                                                {product.categoryName}
                                                            </p>
                                                            <p className="text-sm dark:text-white leading-none text-gray-800">
                                                                <span className="dark:text-gray-400 text-gray-400">
                                                                    Danh mục phụ:{' '}
                                                                </span>
                                                                {product.subCategoryName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between space-x-8 items-start w-full">
                                                        <p className="text-base dark:text-white xl:text-lg leading-6">
                                                            {currencyFormat(product.price)}
                                                        </p>
                                                        <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">
                                                            x {product.quantity}
                                                        </p>
                                                        <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
                                                            {currencyFormat(product.price * product.quantity)}
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
                                                        {currencyFormat(total ?? 0)}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center w-full">
                                                    <p className="text-base dark:text-white leading-4 text-gray-800">
                                                        Giảm giá{' '}
                                                    </p>
                                                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                        -
                                                        {currencyFormat(
                                                            (total ?? 0) +
                                                                orderDetail.shipCost -
                                                                orderDetail.totalPrice,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center w-full">
                                                    <p className="text-base dark:text-white leading-4 text-gray-800">
                                                        Phí vận chuyển
                                                    </p>
                                                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                        {currencyFormat(orderDetail.shipCost)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center w-full">
                                                <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                                                    Tổng
                                                </p>
                                                <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                                                    {currencyFormat(orderDetail.totalPrice)}
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
                                                            {orderDetail.payment?.paymentMethod}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <p className="text-base dark:text-white leading-4 text-gray-800">
                                                            Trạng thái
                                                        </p>
                                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                            {orderDetail.payment?.paymentStatus == 'Processing'
                                                                ? 'Đang chờ thanh toán'
                                                                : orderDetail.payment.paymentStatus == 'Completed'
                                                                ? 'Đã thanh toán'
                                                                : orderDetail.payment?.paymentStatus === 'Cancelled'
                                                                ? 'Đã hủy'
                                                                : orderDetail.payment?.paymentStatus === 'Refunding'
                                                                ? 'Đang hoàn tiền'
                                                                : orderDetail.payment?.paymentStatus === 'Refunded'
                                                                ? 'Đã hoàn tiền'
                                                                : 'primary'}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {orderDetail.returnRequests && orderDetail.returnRequests.length > 0 && (
                                        <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                                            <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                                                Chi tiết hoàn trả
                                            </p>
                                            <div className="gap-3 py-6 sm:flex sm:items-start">
                                                <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
                                                    <div className="space-y-0.5">
                                                        <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                                                            {orderDetail?.userResponse.name}
                                                        </p>
                                                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                            {orderDetail?.returnRequests
                                                                ? orderDetail?.returnRequests[0].createdAt.split(
                                                                      'T',
                                                                  )[0] +
                                                                  ' lúc ' +
                                                                  orderDetail?.returnRequests[0].createdAt
                                                                      .split('T')[1]
                                                                      .slice(0, 8)
                                                                : ''}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                                                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                                                        {orderDetail?.returnRequests
                                                            ? orderDetail?.returnRequests[0].reason
                                                            : ''}
                                                    </p>

                                                    <div className="flex gap-2">
                                                        {orderDetail.returnRequests[0].mediaFiles.map((media) => {
                                                            if (media.mediaType === 'IMAGE') {
                                                                return (
                                                                    <>
                                                                        <img
                                                                            className="h-32 w-20 rounded-lg object-cover"
                                                                            src={media.mediaLink}
                                                                            alt="Ảnh sản phẩm lỗi"
                                                                            onClick={() => setIsOpen(true)}
                                                                        />
                                                                        {/* Modal hiển thị ảnh lớn */}
                                                                        {isOpen && (
                                                                            <div
                                                                                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                                                                                onClick={() => setIsOpen(false)}
                                                                            >
                                                                                <img
                                                                                    className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
                                                                                    src={media.mediaLink}
                                                                                    alt="Phóng to ảnh"
                                                                                    onClick={(e) => e.stopPropagation()} // tránh đóng khi click vào ảnh
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                );
                                                            } else {
                                                                return (
                                                                    <video
                                                                        key={media.id}
                                                                        controls
                                                                        className="h-32 w-20 rounded-lg object-cover"
                                                                    >
                                                                        <source
                                                                            src={media.mediaLink}
                                                                            type="video/mp4"
                                                                        />
                                                                        Trình duyệt của bạn không hỗ trợ phát video.
                                                                    </video>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {(orderDetail.payment?.paymentStatus === 'Refunding' ||
                                        orderDetail.payment?.paymentStatus === 'Refunded') && (
                                        <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                                            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                                                    Thông tin chuyển khoản
                                                </h3>
                                                <div className="flex justify-center items-center w-full space-y-4 flex-col pb-4">
                                                    <div className="flex justify-between w-full">
                                                        <p className="text-base dark:text-white leading-4 text-gray-800">
                                                            Tên
                                                        </p>
                                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                            {orderDetail.payment?.bankHolder}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <p className="text-base dark:text-white leading-4 text-gray-800">
                                                            Ngân hàng
                                                        </p>
                                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                            {orderDetail.payment?.bankName}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <p className="text-base dark:text-white leading-4 text-gray-800">
                                                            STK
                                                        </p>
                                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                                            {orderDetail.payment?.bankNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                                    <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                                        Khách hàng {orderDetail.userResponse.name}
                                    </h3>
                                    <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                                        <div className="flex flex-col justify-start items-start flex-shrink-0">
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
                                                    {orderDetail.userResponse.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                                            <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                                                <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                                    <div className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                                        Thông tin người nhận hàng
                                                    </div>
                                                    <div className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                                        <div>Tên: {orderDetail.buyerName}</div>
                                                        <div>SĐT: {orderDetail.phoneNumber}</div>
                                                        <div>Địa chỉ: {orderDetail.address}</div>
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
