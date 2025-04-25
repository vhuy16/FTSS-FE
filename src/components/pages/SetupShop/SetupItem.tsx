import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { commonCardStyles } from "@styles/card";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { useDispatch } from "react-redux";
import { currencyFormat } from "@ultils/helper";
import { SetupPackage } from "@redux/slices/setupSlice";

interface ProductItemProps {
  setup: SetupPackage;
}
const ProductTitle = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
`;

const ProductCardWrapper = styled.div`
  ${commonCardStyles}
  @media(max-width: ${breakpoints.sm}) {
    padding-left: 0;
    padding-right: 0;
  }

  .product-img {
    height: 290px;
    position: relative;

    @media (max-width: ${breakpoints.sm}) {
      height: 320px;
    }
  }

  .product-wishlist-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border-radius: 100%;

    &:hover {
      background-color: ${defaultTheme.color_yellow};
      color: ${defaultTheme.color_white};
    }
  }
`;

const SetupItem: React.FC<ProductItemProps> = ({ setup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <ProductCardWrapper
      key={setup.setupPackageId}
      onClick={() => {
        navigate(`/setup-package-shop/${setup.setupPackageId}`);
      }}
    >
      <div className="product-img">
        <img className="object-fit-cover" src={setup.images} alt="Ảnh sản phẩm" />
      </div>
      <div className="product-info">
        <ProductTitle className="font-normal">{setup.setupName}</ProductTitle>
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-gray" style={{ color: "gray" }}>
            {setup.size}
          </span>
          <span className="text-outerspace font-bold text-red" style={{ color: "red" }}>
            {currencyFormat(setup.totalPrice ?? 0)}
          </span>
        </div>
      </div>
    </ProductCardWrapper>
  );
};

export default SetupItem;
