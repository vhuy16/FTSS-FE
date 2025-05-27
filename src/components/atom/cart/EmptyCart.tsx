import styled from 'styled-components';
import { Container } from '@styles/styles';
import cartEmpty from '@images/empty_cart_img.svg';

import React from 'react';
import { Link } from 'react-router-dom';
import { BaseBtnGreen, BaseLinkGreen } from '@styles/button';

// Kiểu cho styled component
const CartEmptyScreenWrapper = styled.main`
    margin: 24px 0;
    .empty-cart-img {
        width: 240px;
        overflow: hidden;
    }

    .empty-cart-msg {
        border-radius: 6px;
        padding: 24px 0;
        margin-top: 16px;
        max-width: 400px;
        gap: 12px;
    }
`;

const CartEmptyScreen: React.FC = () => {
    return (
        <CartEmptyScreenWrapper className="page-py-spacing">
            <Container>
                <div className="flex items-center justify-center flex-col">
                    <div className="empty-cart-img">
                        <img src={cartEmpty} alt="Empty Cart" className="object-fit-cover" />
                    </div>
                    <div className="empty-cart-msg w-full flex flex-col justify-center items-center">
                        <p className="text-4xl text-center font-semibold text-outerspace">
                            Giỏ hàng của bạn trống rỗng
                        </p>
                        <p className="text-gray italic">Thêm sản phẩm vào giỏ hàng!</p>
                        <Link to={'/product'}>
                            <BaseBtnGreen>Tiếp tục mua sắm</BaseBtnGreen>
                        </Link>
                    </div>
                </div>
            </Container>
        </CartEmptyScreenWrapper>
    );
};

export default CartEmptyScreen;
