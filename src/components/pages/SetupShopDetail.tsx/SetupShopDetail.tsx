import styled from "styled-components";
import { Container } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { product_one } from "./data";
import ProductPreview from "@components/atom/products/ProductPreview";
import { Link, useParams } from "react-router-dom";
import { BaseBtnGreen, BaseButtonGreen } from "@styles/button";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import ProductDescriptionTab from "@components/atom/products/ProductDescriptionTab";
import ProductSimilar from "@components/atom/products/ProductSimilar";
import ProductServices from "@components/atom/products/ProductServices";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { addItem } from "@redux/slices/cartSlice";
import { useEffect, useState } from "react";
import { getProductDetail } from "@redux/slices/productDetailSlice";
import { currencyFormat } from "@ultils/helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "@components/atom/Loading/Loading";
import { getSetupDetail } from "@redux/slices/setupDetailSlice";
import SetupPreview from "../SetupShop/SetupPreview";
import SetupDescriptionTab from "../SetupShop/SetupDescriptionTab";

const DetailsScreenWrapper = styled.main`
  margin: 40px 0;
`;

const DetailsContent = styled.div`
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;

  @media (max-width: ${breakpoints.xl}) {
    gap: 24px;
    grid-template-columns: 3fr 2fr;
  }

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 100%;
  }
`;

const ProductDetailsWrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 24px;

  @media (max-width: ${breakpoints.sm}) {
    padding: 16px;
  }

  @media (max-width: ${breakpoints.xs}) {
    padding: 12px;
  }

  .prod-title {
    margin-bottom: 10px;
  }
  .rating-and-comments {
    column-gap: 16px;
    margin-bottom: 20px;
  }
  .prod-rating {
    column-gap: 10px;
  }
  .prod-comments {
    column-gap: 10px;
  }
  .prod-add-btn {
    min-width: 160px;
    column-gap: 8px;
    &-text {
      margin-top: 2px;
    }
  }

  .btn-and-price {
    margin-top: 36px;
    column-gap: 16px;
    row-gap: 10px;

    @media (max-width: ${breakpoints.sm}) {
      margin-top: 24px;
    }
  }
`;

const ProductSizeWrapper = styled.div`
  .prod-size-top {
    gap: 20px;
  }
  .prod-size-list {
    gap: 12px;
    margin-top: 16px;
    @media (max-width: ${breakpoints.sm}) {
      gap: 8px;
    }
  }

  .prod-size-item {
    position: relative;
    height: 38px;
    width: 38px;
    cursor: pointer;

    @media (max-width: ${breakpoints.sm}) {
      width: 32px;
      height: 32px;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 38px;
      height: 38px;
      opacity: 0;
      cursor: pointer;

      @media (max-width: ${breakpoints.sm}) {
        width: 32px;
        height: 32px;
      }

      &:checked + span {
        color: ${defaultTheme.color_white};
        background-color: ${defaultTheme.color_outerspace};
        border-color: ${defaultTheme.color_outerspace};
      }
    }

    span {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      border: 1.5px solid ${defaultTheme.color_silver};
      text-transform: uppercase;

      @media (max-width: ${breakpoints.sm}) {
        width: 32px;
        height: 32px;
      }
    }
  }
`;

const ProductColorWrapper = styled.div`
  margin-top: 32px;

  @media (max-width: ${breakpoints.sm}) {
    margin-top: 24px;
  }

  .prod-colors-top {
    margin-bottom: 16px;
  }

  .prod-colors-list {
    column-gap: 12px;
  }

  .prod-colors-item {
    position: relative;
    width: 22px;
    height: 22px;
    transition: ${defaultTheme.default_transition};

    &:hover {
      scale: 0.9;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 22px;
      height: 22px;
      opacity: 0;
      cursor: pointer;

      &:checked + span {
        outline: 1px solid ${defaultTheme.color_gray};
        outline-offset: 3px;
      }
    }

    .prod-colorbox {
      border-radius: 100%;
      width: 22px;
      height: 22px;
      display: inline-block;
    }
  }
`;
const ActionsWrapper = styled.div`
  /* Nếu bạn muốn 2 phần tử nằm ngang, 
     ta đã có "flex items-center flex-wrap" 
     (từ Tailwind hay tùy framework). 
     Nếu muốn, bạn có thể dùng styled-components thuần như bên dưới:

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  */
  gap: 25px; /* Khoảng cách giữa 2 nút */
  margin-top: 20px;
`;
const QuantityWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 63px;
  padding: 10px 16px;

  button {
    background: transparent;
    border: none;
    font-size: 25px; /* Tăng cỡ chữ để dấu +, - to hơn */
    font-weight: 700;
    width: 40px; /* Tạo chút chiều rộng để dễ bấm */
    height: 25px; /* Tạo chút chiều cao để dễ bấm */
    cursor: pointer;
    outline: none;
    line-height: 1; /* Đảm bảo text không bị đẩy lên hoặc xuống */
    text-align: center; /* Căn giữa dấu +, - trong button */
  }

  span {
    margin: 0 8px;
    font-size: 18px; /* Cỡ chữ cho số */
    font-weight: 500;
    min-width: 20px;
    text-align: center;
    line-height: 1;
  }
`;

const AddToCartButton = styled.button`
  background-color: #10ac97;
  color: #fff;
  border: none;
  border-radius: 63px;
  padding: 10px 55px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;

  display: inline-flex;
  align-items: center;
  gap: 8px; /* Khoảng cách giữa icon và text */

  &:hover {
    background-color: #0e8c7c;
  }

  i.bi-cart2 {
    font-size: 18px;
  }
`;

const SetupShopDetailScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const setupData = useAppSelector((state) => state.setupPackageDetail.data);
  const { setupPackageId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getSetupDetail(setupPackageId as string));
  }, [setupPackageId]);

  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`text-yellow ${
        index < Math.floor(product_one.rating)
          ? "bi bi-star-fill"
          : index + 0.5 === product_one.rating
          ? "bi bi-star-half"
          : "bi bi-star"
      }`}
    ></span>
  ));

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Sản phẩm", link: "/product" },
  ];

  const [quantity, setQuantity] = useState<number>(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <DetailsScreenWrapper>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <DetailsContent className="grid">
          {setupData ? <SetupPreview setup={setupData} /> : <Loading></Loading>}
          {setupData ? (
            <ProductDetailsWrapper>
              <h2 className="prod-title font-bold text-2xl">{setupData?.setupName}</h2>
              <div className="flex items-center rating-and-comments flex-wrap">
                <div className="prod-rating flex items-center text-yellow">
                  {stars}
                  {/* <span className="text-gray text-xs"></span> */}
                </div>
                <div className="prod-comments flex items-start">
                  <span className="prod-comment-icon text-gray">
                    <i className="bi bi-chat-left-text"></i>
                  </span>
                  <span className="prod-comment-text text-sm text-gray">{10} comment(s)</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-outerspace mt-4 mb-4">{currencyFormat(setupData.totalPrice)}</p>
              <ProductSizeWrapper>
                <div className="prod-size-top flex items-center flex-wrap">
                  <p className="text-sm font-semibold text-outerspace">Mô tả: {setupData.description}</p>
                </div>
              </ProductSizeWrapper>
              <p className="text-sm font-semibold text-outerspace mt-4">
                Kích thước :<span className="text-sm text-gray font-thin"> {setupData.size}</span>
              </p>
              <ActionsWrapper className="flex items-center flex-wrap">
                <BaseButtonGreen
                  type="submit"
                  className="checkout-btn"
                  onClick={() => {
                    const token = localStorage.getItem("access_token");
                    if (token) {
                      navigate("/checkout");
                    } else {
                      toast.warning("Xin mời đăng nhập trước để thanh toán");
                      navigate("/login");
                    }
                  }}
                >
                  Mua ngay
                </BaseButtonGreen>
              </ActionsWrapper>

              <ProductServices />
            </ProductDetailsWrapper>
          ) : (
            <Loading></Loading>
          )}
        </DetailsContent>
        <SetupDescriptionTab setup={setupData} />
        <ProductSimilar />
      </Container>
    </DetailsScreenWrapper>
  );
};

export default SetupShopDetailScreen;
