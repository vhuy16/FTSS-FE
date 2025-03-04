import { useState } from "react";
import styled from "styled-components";
import { productDescriptionTabHeads } from "../ProductDetail/data";
import Title from "@common/Title";
import { ContentStylings } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { Product } from "@redux/slices/productSlice";
import { SetupPackage } from "@redux/slices/setupSlice";
import { ProductCard, ProductList, SetupItem, SetupItemsList } from "../Setup/SetupStyles";
import { currencyFormat } from "@ultils/helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface TabHead {
  id: string;
  tabHead: string;
  tabText: string;
  badgeValue?: number;
  badgeColor?: "purple" | "outerspace"; // Add more badge colors as needed
}

const DetailsContent = styled.div`
  margin-top: 60px;
  @media (max-width: ${breakpoints.lg}) {
    margin-top: 40px;
  }

  .details-content-wrapper {
    gap: 40px;

    @media (max-width: ${breakpoints.lg}) {
      gap: 24px;
    }
  }
`;

const DescriptionTabsWrapper = styled.div`
  .tabs-heads {
    column-gap: 20px;
    row-gap: 16px;
    margin-bottom: 24px;

    @media (max-width: ${breakpoints.sm}) {
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    @media (max-width: ${breakpoints.xs}) {
      gap: 12px;
    }
  }

  .tabs-head {
    padding-bottom: 16px;
    position: relative;

    &-active {
      color: ${defaultTheme.color_outerspace};

      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 100%;
        width: 40px;
        height: 1px;
        background-color: ${defaultTheme.color_outerspace};
      }
    }

    @media (max-width: ${breakpoints.sm}) {
      padding-bottom: 12px;
    }
  }

  .tabs-badge {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    font-size: 10px;
    margin-left: 6px;

    &-purple {
      background-color: ${defaultTheme.color_purple};
    }

    &-outerspace {
      background-color: ${defaultTheme.color_outerspace};
    }
  }

  .tabs-contents {
    max-height: 400px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
      border-radius: 12px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${defaultTheme.color_platinum};
      border-radius: 12px;
    }
  }

  .tabs-content {
    display: none;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.02);

    &.show {
      display: block;
    }

    @media (max-width: ${breakpoints.sm}) {
      padding: 12px;
    }
  }
`;
type SetupDescriptionTabProps = {
  setup: SetupPackage | null;
};
const SetupDescriptionTab = ({ setup }: SetupDescriptionTabProps) => {
  const [activeDesTab, setActiveDesTab] = useState<string>(productDescriptionTabHeads[0].tabHead);
  const navigate = useNavigate();
  const handleTabChange = (tabHead: string) => {
    setActiveDesTab(tabHead);
  };

  return (
    <DetailsContent>
      <Title titleText={"Mô tả sản phẩm"} />
      <div className="details-content-wrapper grid">
        <DescriptionTabsWrapper>
          <div className="tabs-heads flex items-center flex-wrap">
            {productDescriptionTabHeads.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className="tabs-head text-gray font-medium text-lg flex items-center"
                onClick={() => handleTabChange(tab.tabHead)}
              >
                <span className={`${tab.tabHead === activeDesTab ? "text-sea-green" : ""}`}>{tab.tabText}</span>
                {tab.badgeValue && (
                  <span
                    className={`tabs-badge inline-flex items-center justify-center text-white tabs-badge-${tab.badgeColor}`}
                  >
                    {tab.badgeValue}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="tabs-contents">
            <div className={`tabs-content ${activeDesTab === "tabDescription" ? "show" : ""}`}>
              <ContentStylings>
                <SetupItemsList>
                  {setup?.products.map((product) => (
                    <SetupItem key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                      <div className="product-info">
                        <img
                          src={
                            Array.isArray(product.images)
                              ? (product.images[0] as string)
                              : (product.images as string) ?? ""
                          }
                          alt={product.productName}
                          className="product-image"
                        />
                        <div className="product-info-center">
                          <h2 className="product-name">{product.productName}</h2>
                          <div className="product-quantity">Số lượng: {product.quantity}</div>
                        </div>
                        <div className="product-info-last">
                          <h2 className="current-price">{currencyFormat(product.price ?? 0)}</h2>
                        </div>
                      </div>
                    </SetupItem>
                  ))}
                </SetupItemsList>
              </ContentStylings>
            </div>
            <div className={`tabs-content content-stylings ${activeDesTab === "tabComments" ? "show" : ""}`}>
              User comments here.
            </div>
            <div className={`tabs-content content-stylings ${activeDesTab === "tabQNA" ? "show" : ""}`}>
              Question & Answers
            </div>
          </div>
        </DescriptionTabsWrapper>
        {/* <ProductDescriptionMedia /> */}
      </div>
    </DetailsContent>
  );
};

export default SetupDescriptionTab;
