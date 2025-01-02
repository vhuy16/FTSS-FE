import CustomNextArrow from "@common/CustomNextArrow";
import CustomPrevArrow from "@common/CustomPrevArrow";
import Title from "@common/Title";
import { commonCardStyles } from "@styles/card";
import { Container, Section } from "@styles/styles";
import { breakpoints } from "@styles/themes/default";
import Slider from "react-slick";
import styled from "styled-components";
import { newArrivalData } from "./data";

const ProductCardBoxWrapper = styled.div`
  ${commonCardStyles}
  .product-img {
    height: 262px;
    width: 262px;
  }

  @media (max-width: ${breakpoints.sm}) {
    padding-left: 6px;
    padding-right: 6px;
  }
`;

const ArrivalSliderWrapper = styled.div`
  .custom-prev-arrow {
    top: 43%;
    left: -18px;
    @media (max-width: ${breakpoints.xxl}) {
      left: 24px;
    }

    @media (max-width: ${breakpoints.xs}) {
      left: 4px;
    }
  }

  .custom-next-arrow {
    top: 43%;
    right: -18px;
    @media (max-width: ${breakpoints.xxl}) {
      right: 24px;
    }

    @media (max-width: ${breakpoints.xs}) {
      right: 4px;
    }
  }
`;

const Category = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
  };

  return (
    <Section>
      <Container>
        <Title titleText={"Loại hàng"} />
        <ArrivalSliderWrapper>
          <Slider nextArrow={<CustomNextArrow />} prevArrow={<CustomPrevArrow />} {...settings}>
            {newArrivalData?.map((newArrival) => {
              return (
                <ProductCardBoxWrapper key={newArrival.id}>
                  <div className="product-img">
                    <img className="object-fit-cover" src={newArrival.imgSource} />
                  </div>
                  <div className="product-info">
                    <p className="font-semibold text-xl">{newArrival.title}</p>
                  </div>
                </ProductCardBoxWrapper>
              );
            })}
          </Slider>
        </ArrivalSliderWrapper>
      </Container>
    </Section>
  );
};

export default Category;
