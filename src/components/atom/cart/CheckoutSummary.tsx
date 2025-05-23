import styled from 'styled-components';
// import { orderData } from "../../data/data";
import { breakpoints, defaultTheme } from '@styles/themes/default';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { CartItem, getAllCart } from '@redux/slices/cartSlice';
import { currencyFormat } from '@ultils/helper';
import { useEffect } from 'react';
import { Voucher } from '@redux/slices/voucherSlice';

const CheckoutSummaryWrapper = styled.div`
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.05), -2px -2px 4px 0px rgba(0, 0, 0, 0.05);
    padding: 40px;

    @media (max-width: ${breakpoints.xl}) {
        padding: 24px;
    }

    @media (max-width: ${breakpoints.sm}) {
        padding: 16px;
    }

    @media (max-width: ${breakpoints.xs}) {
        background-color: transparent;
        padding: 0;
        box-shadow: none;
    }

    .order-list {
        row-gap: 24px;
        margin-top: 20px;

        @media (max-width: ${breakpoints.sm}) {
            row-gap: 16px;
        }
    }

    .order-item {
        grid-template-columns: 60px auto;
        gap: 16px;

        @media (max-width: ${breakpoints.xs}) {
            align-items: center;
        }

        &-img {
            width: 60px;
            height: 60px;
            overflow: hidden;
            border-radius: 4px;
        }

        &-info {
            gap: 16px;

            @media (max-width: ${breakpoints.xs}) {
                flex-direction: column;
                gap: 6px;
            }
        }
    }

    .order-info {
        margin-top: 30px;
        @media (max-width: ${breakpoints.sm}) {
            margin-top: 20px;
        }

        li {
            margin: 6px 0;
        }

        .list-separator {
            height: 1px;
            background-color: ${defaultTheme.color_anti_flash_white};
            margin: 12px 0;
        }
    }
`;

const CheckoutSummary = ({ selectedVoucher }: { selectedVoucher: Voucher | null }) => {
    const listCart = useAppSelector((state) => state.cart.cartselected);
    const ship = useAppSelector((state) => state.shipment.ship);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getAllCart());
    }, []);
    const totalPrice = listCart.reduce((total: number, item: CartItem) => {
        return total + item.price;
    }, 0);

    const totalItems = listCart.reduce((total: number, item: CartItem) => {
        return total + item.quantity;
    }, 0);
    const caculateDiscount = (totalPrice: number): number => {
        if (selectedVoucher == null) {
            return 0;
        } else {
            let discount = 0;
            if (selectedVoucher.discountType === 'Percentage') {
                discount = parseFloat((totalPrice * (selectedVoucher.discount / 100)).toFixed(2));
                if (discount > selectedVoucher.maximumOrderValue) {
                    discount = selectedVoucher.maximumOrderValue;
                }
                return discount;
            } else {
                if (selectedVoucher.discount > totalPrice) {
                    discount = totalPrice;
                } else {
                    discount = selectedVoucher.discount;
                }
                return discount;
            }
        }
    };

    return (
        <CheckoutSummaryWrapper>
            <h4 className="text-xxl font-bold text-outersapce">Tóm tắt đơn hàng thanh toán</h4>
            <div className="order-list grid">
                {listCart?.map((cart) => {
                    return (
                        <div className="order-item grid" key={cart.cartItemId}>
                            <div className="order-item-img">
                                <img src={cart.linkImage ? cart.linkImage : ''} className="object-fit-cover" alt="" />
                            </div>
                            <div className="order-item-info flex justify-between">
                                <div className="order-item-info-l">
                                    <p className="text-base font-bold text-outerspace">
                                        {cart.productName}&nbsp;
                                        <span className="text-gray">x{cart.quantity}</span>
                                    </p>
                                </div>
                                <div className="order-item-info-r text-gray font-bold text-base">
                                    {currencyFormat(cart.price)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <ul className="order-info">
                <li className="flex items-center justify-between">
                    <span className="text-outerspace font-bold text-lg">
                        Tổng phụ <span className="text-gray font-semibold">({totalItems} Sản phẩm)</span>
                    </span>
                    <span className="text-outerspace font-bold text-lg">{currencyFormat(totalPrice)}</span>
                </li>

                <li className="flex items-center justify-between">
                    <span className="text-outerspace font-bold text-lg">Giảm giá</span>
                    <span className="text-outerspace font-bold text-lg">
                        -{currencyFormat(caculateDiscount(totalPrice))}
                    </span>
                </li>
                <li className="flex items-center justify-between">
                    <span className="text-outerspace font-bold text-lg">Phí vận chuyển</span>
                    <span className="text-outerspace font-bold text-lg">{currencyFormat(ship?.total_fee ?? 0)}</span>
                </li>
                <li className="list-separator"></li>
                <li className="flex items-center justify-between">
                    <span className="text-outerspace font-bold text-lg">Tổng</span>
                    <span className="text-outerspace font-bold text-lg">
                        {currencyFormat(totalPrice + (ship?.total_fee ?? 0) - caculateDiscount(totalPrice))}
                    </span>
                </li>
            </ul>
        </CheckoutSummaryWrapper>
    );
};

export default CheckoutSummary;
