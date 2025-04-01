import Breadcrumb from '@common/Breadcrum';
import Title from '@common/Title';
import UserMenu from '@atom/user/UserMenu';
import { Container } from '@styles/styles';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import { UserContent, UserDashboardWrapper } from '@styles/user';
import styled from 'styled-components';
import OrderItemList from './OrderItemList';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { useEffect, useState } from 'react';
import { getAllOrdersByUsers } from '@redux/slices/orderListSlice';
import { getUserProfile } from '@redux/slices/userSlice';
import LoadingPage from '@components/atom/Loading/LoadingPage';

type OrderStatus = 'PROCESSING' | 'PENDING_DELIVERY' | 'PROCESSED' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';

const OrderListScreenWrapper = styled.div`
    background-color: #f6f6f6;
    .order-tabs-contents {
        margin-top: 40px;
    }
    .order-tabs-head {
        min-width: 140px;
        padding: 12px 0;
        border-bottom: 3px solid ${defaultTheme.color_whitesmoke};

        &.order-tabs-head-active {
            border-bottom-color: ${defaultTheme.color_sea_green};
        }

        @media (max-width: ${breakpoints.lg}) {
            min-width: 120px;
        }
        @media (max-width: ${breakpoints.xs}) {
            min-width: 80px;
        }
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;

const breadcrumbItems = [
    { label: 'Trang chủ', link: '/' },
    { label: 'Đơn hàng', link: '/order' },
];

const OrderListScreen = () => {
    const dispatch = useAppDispatch();
    const orderData = useAppSelector((state) => state.orderList.orders) || [];
    const ordersWithSetup = orderData.filter((or) => or.setupPackage !== null);
    const ordersWithProduct = orderData.filter((or) => or.setupPackage == null);
    const isLoading = useAppSelector((state) => state.orderList.loading);
    const [activeTab, setActiveTab] = useState<OrderStatus>('PROCESSING');
    const [selectedCategory, setSelectedCategory] = useState<'PRODUCT' | 'FISH_TANK'>('PRODUCT');

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value as 'PRODUCT' | 'FISH_TANK');
    };
    // useEffect(() => {
    //   dispatch(getUserProfile());
    // }, [dispatch]);
    useEffect(() => {
        dispatch(getAllOrdersByUsers(activeTab));
    }, [dispatch, activeTab]);

    const handleTabClick = (tab: OrderStatus) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    };
    return (
        <OrderListScreenWrapper className="page-py-spacing">
            {isLoading ? (
                <LoadingPage />
            ) : (
                <Container>
                    <Breadcrumb items={breadcrumbItems} />
                    <UserDashboardWrapper>
                        <UserMenu />
                        <UserContent>
                            <div className="header">
                                <Title titleText={'Đơn hàng'} />
                                <div className="inline-block ml-4">
                                    <select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        className="p-2 border rounded-md"
                                    >
                                        <option value="PRODUCT">Sản phẩm</option>
                                        <option value="FISH_TANK">Hồ Cá</option>
                                    </select>
                                </div>
                            </div>
                            <div className="order-tabs mb-12">
                                <div className="order-tabs-heads p-8">
                                    {(
                                        [
                                            'PROCESSING',
                                            'PROCESSED',
                                            'PENDING_DELIVERY',
                                            'COMPLETED',
                                            'CANCELLED',
                                            'RETURNED',
                                        ] as OrderStatus[]
                                    ).map((key) => (
                                        <button
                                            key={key}
                                            type="button"
                                            className={`order-tabs-head mr-7 text-xl italic ${
                                                activeTab === key ? 'order-tabs-head-active' : ''
                                            }`}
                                            onClick={() => handleTabClick(key as OrderStatus)}
                                        >
                                            {key === 'PROCESSING' && 'Đang xử lý'}
                                            {key === 'PROCESSED' && 'Đã xử lý'}
                                            {key === 'PENDING_DELIVERY' && 'Chờ giao hàng'}
                                            {key === 'COMPLETED' && 'Đã giao hàng'}
                                            {key === 'CANCELLED' && 'Đã hủy'}
                                            {key === 'RETURNED' && 'Trả hàng/Hoàn tiền'}
                                        </button>
                                    ))}
                                </div>

                                <div className="order-tabs-contents">
                                    {isLoading ? (
                                        <LoadingPage />
                                    ) : selectedCategory === 'PRODUCT' ? (
                                        ordersWithProduct.length > 0 ? (
                                            <OrderItemList orders={ordersWithProduct} />
                                        ) : (
                                            <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
                                        )
                                    ) : ordersWithSetup.length > 0 ? (
                                        <OrderItemList orders={ordersWithSetup} />
                                    ) : (
                                        <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
                                    )}
                                </div>
                            </div>
                        </UserContent>
                    </UserDashboardWrapper>
                </Container>
            )}
        </OrderListScreenWrapper>
    );
};

export default OrderListScreen;
