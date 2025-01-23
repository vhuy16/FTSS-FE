import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { CartItem, removeItem, updateItemQuantity } from "@redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { currencyFormat } from "@ultils/helper";
import { toast } from "react-toastify";

const CartTableRowWrapper = styled.tr`
  .cart-tbl {
    &-prod {
      grid-template-columns: 80px auto;
      column-gap: 12px;

      @media (max-width: ${breakpoints.xl}) {
        grid-template-columns: 60px auto;
      }
    }

    &-qty {
      .qty-inc-btn,
      .qty-dec-btn {
        width: 24px;
        height: 24px;
        border: 1px solid ${defaultTheme.color_platinum};
        border-radius: 2px;

        &:hover {
          border-color: ${defaultTheme.color_sea_green};
          background-color: ${defaultTheme.color_sea_green};
          color: ${defaultTheme.color_white};
        }
      }

      .qty-value {
        width: 40px;
        height: 24px;
      }
    }
  }

  .cart-prod-info {
    p {
      margin-right: 8px;
      span {
        margin-right: 4px;
      }
    }
  }

  .cart-prod-img {
    width: 80px;
    height: 80px;
    overflow: hidden;
    border-radius: 8px;

    @media (max-width: ${breakpoints.xl}) {
      width: 60px;
      height: 60px;
    }
  }
`;
type CartItemProps = {
  cartItem: CartItem;
};
const CartItemCB = ({ cartItem }: CartItemProps) => {
  const dispatch = useAppDispatch();
  const productData = useAppSelector((state) =>
    state.product.data?.items.find((product) => product.id === cartItem.productId)
  );

  const availableQuantity = productData ? productData.quantity : 0; // Tính số lượng khả dụng

  return (
    <CartTableRowWrapper key={cartItem.cartItemId}>
      <td>
        <div className="cart-tbl-prod grid">
          <div className="cart-prod-img">
            <img src={cartItem.linkImage} className="object-fit-cover" alt="" />
          </div>
          <div className="cart-prod-info">
            <h4 className="text-base">{cartItem.productName}</h4>
          </div>
        </div>
      </td>
      <td>
        <span className="text-lg font-bold text-outerspace">{currencyFormat(cartItem.unitPrice || 0)}</span>
      </td>
      <td>
        <div className="cart-tbl-qty flex items-center">
          <button
            className="qty-dec-btn"
            onClick={() => {
              if (cartItem.quantity > 1) {
                // Giảm số lượng xuống 1
                dispatch(updateItemQuantity({ cartItemId: cartItem.cartItemId, quantity: cartItem.quantity - 1 }));
              } else {
                toast.error("Số lượng sản phẩm không thể nhỏ hơn 1");
              }
            }}
          >
            <i className="bi bi-dash-lg"></i>
          </button>
          <span className="qty-value inline-flex items-center justify-center font-medium text-outerspace">
            {cartItem.quantity}
          </span>
          <button
            className="qty-inc-btn"
            onClick={() => {
              if (cartItem.quantity >= availableQuantity) {
                toast.error("Không thể thêm số lượng vượt quá khả dụng!");
              } else {
                dispatch(
                  updateItemQuantity({
                    cartItemId: cartItem.cartItemId,
                    quantity: cartItem.quantity + 1,
                  })
                );
              }
            }}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </td>
      <td>
        <span className="cart-tbl-shipping uppercase text-gray-150 font-bold">₫0</span>
      </td>
      <td>
        <span className="text-lg font-bold text-outerspace"> {currencyFormat(cartItem.price || 0)}</span>
      </td>
      <td>
        <div
          className="cart-tbl-actions flex justify-center"
          onClick={() => {
            dispatch(removeItem({ cartItemId: cartItem.cartItemId }));
          }}
        >
          <i className="bi bi-trash3 tbl-del-action text-red-500"></i>
        </div>
      </td>
    </CartTableRowWrapper>
  );
};

export default CartItemCB;

CartItemCB.propTypes = {
  cartItem: PropTypes.object,
};
