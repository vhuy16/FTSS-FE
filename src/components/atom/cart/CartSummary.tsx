import styled from 'styled-components';
import { BaseButtonGreen } from '@styles/button';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@redux/hook';
import { CartItem } from '@redux/slices/cartSlice';
import { currencyFormat } from '@ultils/helper';
import { toast } from 'react-toastify';

const CartSummaryWrapper = styled.div`
    background-color: ${defaultTheme.color_flash_white};
    padding: 16px;

    .checkout-btn {
        min-width: 100%;
    }

    .summary-list {
        padding: 20px;

        @media (max-width: ${breakpoints.xs}) {
            padding-top: 0;
            padding-right: 0;
            padding-left: 0;
        }

        .summary-item {
            margin: 6px 0;

            &:last-child {
                margin-top: 20px;
                border-top: 1px dashed ${defaultTheme.color_sea_green};
                padding-top: 10px;
            }
        }
    }
`;
type CartSummaryProps = {
    totalPrice: number;
};
// interface CartCheckOutType extends CartItem {
//     subTotal: number;
// }
const CartSummary = ({ totalPrice }: CartSummaryProps) => {
    // const listCart: CartItem[] = useAppSelector((state) => state.cart.items);
    // const listCartCheckOut: CartCheckOutType[] = listCart.map((cart): CartCheckOutType => {
    //     return { ...cart, subTotal: cart.quantity * cart.item.price };
    // });
    const navigate = useNavigate();
    return (
        <CartSummaryWrapper>
            <ul className="summary-list">
                <li className="summary-item flex justify-between">
                    <span className="font-medium text-outerspace">Tổng Phụ</span>
                    <span className="font-medium text-outerspace">{currencyFormat(totalPrice)}</span>
                </li>
                <li className="summary-item flex justify-between">
                    <span className="font-medium text-outerspace">Phí Vận Chuyển</span>
                    <span className="font-medium text-outerspace">0</span>
                </li>
                <li className="summary-item flex justify-between">
                    <span className="font-medium text-outerspace">Tổng</span>
                    <span className="summary-item-value font-bold text-outerspace">{currencyFormat(totalPrice)}</span>
                </li>
            </ul>

            <BaseButtonGreen
                type="submit"
                className="checkout-btn"
                onClick={() => {
                    const token = localStorage.getItem('access_token');
                    if (token) {
                        navigate('/checkout');
                    } else {
                        toast.warning('Xin mời đăng nhập trước để thanh toán');
                        navigate('/login');
                    }
                }}
            >
                Tiến hành thanh toán
            </BaseButtonGreen>
        </CartSummaryWrapper>
    );
};

export default CartSummary;
