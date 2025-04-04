import styled from 'styled-components';
import PropTypes from 'prop-types';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import { currencyFormat } from '@ultils/helper';
import { BaseBtnGreen } from '@styles/button';
import { type } from '@testing-library/user-event/dist/type';
import { Order } from '@redux/slices/orderListSlice';
import { useNavigate } from 'react-router-dom';

interface OrderItemProps {
    order: Order;
}
const OrderDetailListWrapper = styled.div`
    background: #fff;
    padding: 0 25px;

    .order-d-item {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: 46px;
        padding: 12px 0;
        align-items: center;

        @media (max-width: ${breakpoints.sm}) {
            grid-template-columns: 60px 1fr;
            gap: 12px;
        }

        &-img {
            width: 100px;
            height: 100px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

            @media (max-width: ${breakpoints.sm}) {
                width: 60px;
                height: 60px;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        &-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .product-name {
                font-size: 1rem;
                font-weight: bold;
            }

            .variant {
                font-size: 0.875rem;
                color: #666;
            }

            .quantity {
                font-size: 0.875rem;
                color: #666;
            }
        }

        &-price {
            text-align: right;
            min-width: 100px;

            p {
                margin: 0;
            }

            .line-through {
                text-decoration: line-through;
                color: gray;
            }

            .text-red-500 {
                font-size: 1.2rem;
                font-weight: bold;
                color: red;
            }
        }
    }

    /* Phần tổng kết */
    .order-summary {
        width: 100%;
    }

    .order-summary table {
        width: 100%;
        border-collapse: collapse;
    }

    .order-summary td {
        padding: 8px 0;
        text-align: right;
        border-bottom: 1px solid #ddd;
    }

    .order-summary tr:last-child td {
        border-bottom: none;
    }

    .order-summary .text-red-500 {
        color: #fd053b;
    }

    .order-summary .text-gray-500 {
        color: #6b7280;
    }

    .order-summary .font-bold {
        font-weight: bold;
    }
`;

interface OrderDetail {
    productName: string;
    price: number;
    quantity: number;
    linkImage: string;
}

interface OrderItemProps {
    order: Order;
    item: OrderDetail;
}
const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
    const navigate = useNavigate();
    return (
        <OrderDetailListWrapper className="order-d-list">
            <>
                <div className="order-d-item grid">
                    {/* Hình ảnh sản phẩm */}
                    <div className="order-d-item-img">
                        <img src={item.linkImage} alt={item.productName} className="object-fit-cover" />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="order-d-item-info">
                        <p className="text-xl font-bold">{item.productName}</p>
                        <p className="text-gray">x{item.quantity}</p>
                    </div>

                    {/* Giá sản phẩm */}
                    <div className="order-d-item-price">
                        <p className="text-gray-500 font-bold">{currencyFormat(item.price)}</p>
                    </div>
                </div>
                {/* Thông tin tổng đơn hàng */}
            </>
        </OrderDetailListWrapper>
    );
};

export default OrderItem;
