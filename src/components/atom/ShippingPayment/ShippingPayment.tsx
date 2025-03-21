import styled from 'styled-components';
import { Input } from '@styles/form';
// import { cardsData } from "../../data/data";
import { BaseButtonGreen } from '@styles/button';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import { useAppSelector } from '@redux/hook';
import { CartItem } from '@redux/slices/cartSlice';

const ShippingPaymentWrapper = styled.div`
    .shipping-addr,
    .shipping-method,
    .payment-method {
        margin: 20px 0;

        &-title {
            margin-bottom: 8px;
        }

        .list-group {
            padding: 24px;
            background-color: ${defaultTheme.color_whitesmoke};
            max-width: 818px;
            margin-top: 24px;
            border-radius: 12px;

            @media (max-width: ${breakpoints.sm}) {
                padding: 16px;
                border-radius: 8px;
                margin-top: 16px;
            }
        }

        .list-group-item {
            column-gap: 20px;
        }
        .horiz-line-separator {
            margin: 20px 0;
            @media (max-width: ${breakpoints.sm}) {
                margin: 12px 0;
            }
        }
    }

    .payment-method {
        .list-group-item {
            &-head {
                column-gap: 20px;
            }
        }

        .payment-cards {
            gap: 20px;
            margin: 24px 0 30px 34px;

            @media (max-width: ${breakpoints.lg}) {
                gap: 16px;
            }

            @media (max-width: ${breakpoints.sm}) {
                margin-top: 16px;
                margin-bottom: 16px;
                gap: 10px;
                margin-left: 0;
            }
            .payment-card {
                position: relative;
                width: 80px;
                height: 46px;
                input {
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 80px;
                    height: 46px;
                    z-index: 10;
                    cursor: pointer;

                    &:checked {
                        & + .card-wrapper {
                            .card-selected {
                                position: absolute;
                                top: -8px;
                                right: -5px;
                                width: 14px;
                                height: 14px;
                                display: inline-block;
                            }
                        }
                    }
                }

                .card-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-radius: 5px;
                    border: 1px solid rgba(0, 0, 0, 0.1);

                    .card-selected {
                        display: none;
                        transition: ${defaultTheme.default_transition};
                    }
                }
            }
        }

        .payment-details {
            margin-left: 34px;
            display: grid;
            row-gap: 16px;

            @media (max-width: ${breakpoints.sm}) {
                margin-left: 0;
            }

            .form-elem-group {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 24px;
                @media (max-width: ${breakpoints.sm}) {
                    grid-template-columns: 100%;
                    gap: 0;
                }
            }

            .form-elem {
                height: 40px;
                border: 1px solid ${defaultTheme.color_platinum};
                border-radius: 6px;
                padding: 16px;

                &:focus {
                    border-color: ${defaultTheme.color_sea_green};
                }

                @media (max-width: ${breakpoints.sm}) {
                    margin-bottom: 10px;
                    border-radius: 4px;
                }
            }
        }
    }

    .pay-now-btn {
        @media (max-width: ${breakpoints.sm}) {
            width: 100%;
        }
    }
`;

const ShippingPayment = () => {
    const setupId = useAppSelector((state) => state.cart.setupId);
    const listCart = useAppSelector((state) => state.cart.cartselected);
    const totalPrice = listCart.reduce((total: number, item: CartItem) => {
        return total + item.price;
    }, 0);
    return (
        <ShippingPaymentWrapper>
            <div className="shipping-addr">
                <h3 className="text-xxl font-bold text-outerspace">Phương thức thanh toán</h3>
                <p className="text-base text-outerspace">Chọn phương thức thanh toán.</p>
                <div className="list-group">
                    <div className="list-group-item flex items-center">
                        <input type="radio" name="shipping_addr" checked />
                        <span className="font-semibold text-lg">Thanh toán online</span>
                    </div>
                </div>
            </div>
            {setupId && (
                <div className="shipping-addr">
                    <h3 className="text-xxl font-bold text-outerspace">Dịch vụ bảo trì</h3>
                    <p className=" text-yellow-500 font-bold">
                        Bạn sẽ được tặng dịch dụ bảo trì nếu mua bể cá trên 2 triệu*
                    </p>
                    <div className="list-group">
                        <div className="list-group-item flex items-center">
                            <input type="radio" name="shipping_addrr" checked={totalPrice >= 2000000 ? true : false} />
                            <span className="font-semibold text-lg">Gói bảo trì</span>
                        </div>
                    </div>
                </div>
            )}
        </ShippingPaymentWrapper>
    );
};

export default ShippingPayment;
