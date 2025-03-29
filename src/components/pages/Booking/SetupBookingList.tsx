import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaClock, FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import { Container } from '@styles/styles';
import { UserContent, UserDashboardWrapper } from '@styles/user';
import UserMenu from '@components/atom/user/UserMenu';
import Breadcrumb from '@common/Breadcrumb';
import Title from '@common/Title';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllBookingofUsers } from '@redux/slices/bookingSlice';
import { getUserProfile } from '@redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import beca from '@images/beca.jpg';
import { currencyFormat, formatDate } from '@ultils/helper';
import { BaseBtnGreen } from '@styles/button';
import { getOrderById } from '@redux/slices/orderSlice';
import LoadingPage from '@components/atom/Loading/LoadingPage';
import { getAllOrdersByUsers } from '@redux/slices/orderListSlice';

const WishListScreenWrapper = styled.main`
    .wishlist {
        gap: 20px;
    }
`;

const breadcrumbItems = [
    { label: 'Trang chủ', link: '/' },
    { label: 'Đặt lịch bảo trì', link: '/setup-booking' },
];
const SetupBookingList = () => {
    const orderData = useAppSelector((state) => state.orderList.orders) || [];
    const ordersWithSetup = orderData.filter((or) => or.setupPackage !== null);
    const isLoading = useAppSelector((state) => state.orderList.loading);

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getUserProfile());
        dispatch(getAllOrdersByUsers('COMPLETED'));
    }, []);
    console.log('ordersetup', ordersWithSetup);

    const navigate = useNavigate();

    return (
        <WishListScreenWrapper className="page-py-spacing">
            {isLoading ? (
                <LoadingPage />
            ) : (
                <Container>
                    <Breadcrumb items={breadcrumbItems} />
                    <UserDashboardWrapper>
                        <UserMenu />
                        <UserContent>
                            <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
                                <Title titleText={'Đặt lịch bảo trì'} />
                                {ordersWithSetup.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-lg shadow">
                                        <p className="text-gray-600">Bạn chưa có hồ cá nào ! Vui lòng mua hồ cá.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {ordersWithSetup.map((setup) => (
                                            <div
                                                key={setup?.setupPackage?.setupPackageId}
                                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                            >
                                                <div className="p-6">
                                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                        <div>
                                                            <span
                                                                className={`px-3 py-1 rounded-md text-sm font-medium
                              ${setup?.isEligible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                                     `}
                                                            >
                                                                {setup?.isEligible
                                                                    ? 'Bạn có 1 lần bảo trì miễn phí'
                                                                    : 'Dịch vụ bảo trì tính phí'}
                                                            </span>

                                                            <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mt-4">
                                                                Mã đặt hàng: #{setup?.oderCode}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap md:flex-nowrap gap-6">
                                                        <div className="w-full md:w-3/4">
                                                            <div className="flex justify-between mb-4">
                                                                <div className="flex items-start gap-8 mb-4">
                                                                    <img
                                                                        src={beca}
                                                                        className="w-24 h-24 object-cover rounded-lg"
                                                                    />
                                                                    <div>
                                                                        <h3 className="font-semibold text-gray-900">
                                                                            {setup?.setupPackage?.setupName}
                                                                        </h3>
                                                                        <p className="text-gray-600">
                                                                            Size: {setup?.setupPackage?.size}
                                                                        </p>
                                                                        <p className="text-gray-600">
                                                                            Mô tả: {setup?.setupPackage?.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col gap-3">
                                                                    <BaseBtnGreen
                                                                        onClick={() =>
                                                                            navigate(`/setup-booking/${setup?.id}`)
                                                                        }
                                                                    >
                                                                        Đặt dịch vụ
                                                                    </BaseBtnGreen>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-4 ml-8">
                                                                {setup?.setupPackage?.products?.map((item) => (
                                                                    <div
                                                                        key={item.id}
                                                                        className="flex items-center gap-4 pb-3"
                                                                    >
                                                                        {/* Ảnh sản phẩm */}
                                                                        <img
                                                                            src={item.images}
                                                                            alt={item.productName}
                                                                            className="w-16 h-16 object-cover rounded"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <h3 className="font-medium text-gray-900">
                                                                                    {item.productName}
                                                                                </h3>
                                                                            </div>
                                                                            <p className="text-gray-600 text-sm">
                                                                                Phân loại: {item.categoryName}
                                                                            </p>
                                                                            <p className="text-gray-600 text-sm">
                                                                                x{item.quantity}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 text-sm text-gray-600 border-t pt-4">
                                                        Cảm ơn bạn đã đặt dịch vụ bảo trì của chúng tôi.
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </UserContent>
                    </UserDashboardWrapper>
                </Container>
            )}
        </WishListScreenWrapper>
    );
};

export default SetupBookingList;
