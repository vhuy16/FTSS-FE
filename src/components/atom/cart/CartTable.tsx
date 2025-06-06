import styled from 'styled-components';
import PropTypes from 'prop-types';
import { breakpoints } from '@styles/themes/default';
import { CartItem } from '@redux/slices/cartSlice';
import CartItemCB from './CartItems';
import { useState } from 'react';
import { useAppSelector } from '@redux/hook';

const ScrollbarXWrapper = styled.div`
    overflow-x: scroll;
    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: grey;
    }
`;

const CartTableWrapper = styled.table`
    border-collapse: collapse;
    min-width: 680px;
    border: 1px solid rgba(0, 0, 0, 0.1);

    thead {
        th {
            height: 48px;
            padding-left: 16px;
            padding-right: 16px;
            letter-spacing: 0.09em;

            @media (max-width: ${breakpoints.lg}) {
                padding: 16px 12px;
            }

            @media (max-width: ${breakpoints.xs}) {
                padding: 10px;
            }
        }
    }

    tbody {
        td {
            padding: 24px 18px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);

            @media (max-width: ${breakpoints.lg}) {
                padding: 16px 12px;
            }

            @media (max-width: ${breakpoints.xs}) {
                padding: 10px 6px;
            }
        }
    }
`;
type CartTableProps = {
    cartItems: CartItem[];
};
const CartTable = ({ cartItems }: CartTableProps) => {
    const CART_TABLE_HEADS = ['Sản phẩm', 'Giá', 'Số lượng', 'Tổng phụ', 'Xóa', 'Chọn'];
    return (
        <ScrollbarXWrapper>
            <CartTableWrapper className="w-full">
                <thead>
                    <tr className="text-left">
                        {CART_TABLE_HEADS?.map((column, index) => (
                            <th key={index} className={`bg-black-50 text-white font-semibold text-base `}>
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((cartItem) => {
                        return <CartItemCB key={cartItem.cartItemId} cartItem={cartItem} />;
                    })}
                </tbody>
            </CartTableWrapper>
        </ScrollbarXWrapper>
    );
};

export default CartTable;

CartTable.propTypes = {
    cartItems: PropTypes.array,
};
