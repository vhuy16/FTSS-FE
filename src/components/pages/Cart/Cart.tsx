import styled from 'styled-components';
import { Container } from '@styles/styles';
import Breadcrumb from '@common/Breadcrumb';
import { Link } from 'react-router-dom';

import { breakpoints } from '@styles/themes/default';
import CartDiscount from '@atom/cart/CartDiscount';
import CartSummary from '@atom/cart/CartSummary';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { CartItem, deleteSelectSetupId, getAllCart, removeCart } from '@redux/slices/cartSlice';
import CartEmptyScreen from '@components/atom/cart/EmptyCart';
import CartTable from '@components/atom/cart/CartTable';
import { useEffect, useState } from 'react';

const CartPageWrapper = styled.main`
    padding: 48px 0;

    .breadcrumb-nav {
        margin-bottom: 20px;
    }
`;

const CartContent = styled.div`
    margin-top: 40px;
    grid-template-columns: 2fr 1fr;
    gap: 40px;

    @media (max-width: ${breakpoints.xl}) {
        grid-template-columns: 100%;
    }

    @media (max-width: ${breakpoints.sm}) {
        margin-top: 24px;
    }

    .cart-list {
        @media (max-width: ${breakpoints.lg}) {
            overflow-x: scroll;
        }
    }

    .cart-content-right {
        gap: 24px;

        @media (max-width: ${breakpoints.xl}) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: ${breakpoints.md}) {
            grid-template-columns: 100%;
        }
    }
`;

const CartScreen = () => {
    const selectedCart = useAppSelector((state) => state.cart.cartselected);
    const breadcrumbItems = [
        { label: 'Trang Chủ', link: '/' },
        { label: 'Giỏ Hàng', link: '' },
    ];
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getAllCart());
        dispatch(removeCart());
        dispatch(deleteSelectSetupId());
    }, [dispatch]);
    const listCart: CartItem[] = useAppSelector((state) => state.cart.items);
    const OddCart = listCart.filter((item) => item.status === 'Odd');
    const totalPrice = selectedCart.reduce((total: number, item: CartItem) => {
        return total + item.price; // Cộng trực tiếp giá của từng sản phẩm
    }, 0);

    if (OddCart.length <= 0) {
        return <CartEmptyScreen />;
    }
    const token = localStorage.getItem('access_token');

    return (
        <CartPageWrapper>
            <Container>
                <Breadcrumb items={breadcrumbItems} />
                {!token && (
                    <div className="cart-head">
                        <p className="text-base text-gray">
                            Vui lòng điền vào các trường bên dưới và nhấp vào đặt hàng để hoàn tất giao dịch mua hàng
                            của bạn!
                        </p>
                        <p className="text-gray text-base">
                            Đã đăng ký chưa?
                            <Link to="/login" className="text-sea-green font-medium">
                                &nbsp;Vui lòng đăng nhập tại đây.
                            </Link>
                        </p>
                    </div>
                )}

                <CartContent className="grid items-start">
                    <div className="cart-content-left">
                        <CartTable cartItems={OddCart} />
                    </div>
                    <div className="grid cart-content-right">
                        <CartDiscount />
                        <CartSummary totalPrice={totalPrice} />
                    </div>
                </CartContent>
            </Container>
        </CartPageWrapper>
    );
};

export default CartScreen;
