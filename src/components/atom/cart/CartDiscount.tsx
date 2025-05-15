import styled from "styled-components";
import { Input } from "@styles/form";
import { BaseButtonOuterspace, BaseLinkOutlinePlatinum } from "@styles/button";
import { breakpoints, defaultTheme } from "@styles/themes/default";

const CartDiscountWrapper = styled.div`
  @media (max-width: ${breakpoints.xl}) {
    max-width: 420px;
  }

  @media (max-width: ${breakpoints.md}) {
    max-width: 100%;
  }

  .coupon-group {
    margin-top: 20px;
    overflow: hidden;
    border-radius: 6px;
    height: 40px;
  }

  .coupon-input {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border: 1px solid ${defaultTheme.color_platinum};
    padding-left: 12px;
    padding-right: 12px;
    border-right: none;
  }

  .coupon-btn {
    padding: 2px 16px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .contd-shop-btn {
    height: 40px;
    margin-top: 10px;
  }
`;

const CartDiscount = () => {
  return (
    <CartDiscountWrapper>
      <h3 className="text-xxl text-outerspace">Tìm kiếm thêm sản phẩm</h3>
      <p className="text-base text-gray-150">Tiếp tục mua thêm sản phẩm mới nếu bạn có.</p>
      <BaseLinkOutlinePlatinum as={BaseLinkOutlinePlatinum} to="/" className="contd-shop-btn w-full text-gray">
        Tiếp tục mua sắm
      </BaseLinkOutlinePlatinum>
    </CartDiscountWrapper>
  );
};

export default CartDiscount;
