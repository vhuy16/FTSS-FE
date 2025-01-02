import styled from "styled-components";
import { Container, Section } from "@styles/styles";
import { Link } from "react-router-dom";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import feature2 from "@images/hero1.jpg";
import feature1 from "@images/hero1.jpg";

// Định nghĩa kiểu dữ liệu cho item trong featuredData
export interface FeaturedItem {
  id: string;
  topText: string;
  largeText: string;
  bottomText: string;
  buttonLink: string;
  buttonText: string;
  imgSource: string;
}

export const featuredData: FeaturedItem[] = [
  {
    id: "featured-1",
    topText: "Chào mừng 20-11",
    largeText: "Dịp đặc biệt trong năm",
    bottomText: "Những món quà độc đáo dành cho các thầy cô",
    buttonLink: "/product-1",
    buttonText: "Mua ngay",
    imgSource: feature2,
  },
  {
    id: "featured-2",
    topText: "Nhiều sản phẩm đa dạng ",
    largeText: "Tuần lễ giáng sinh cập bến",
    bottomText: "Dành tặng cho những người mà bạn yêu quý",
    buttonLink: "/product-2",
    buttonText: "Mua ngay",
    imgSource: feature1,
  },
  // Thêm các item khác nếu cần
];

const FeaturedContent = styled.div`
  display: grid; // Thêm display: grid để có thể sử dụng grid-template-columns
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 100%;
  }
`;

const FeaturedCardWrapper = styled.div`
  height: 380px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.4);

  .feat-text-top {
    margin-bottom: 24px;
  }

  .feat-text-large {
    font-size: 38px;
    line-height: 1.2;
  }

  .feat-text-bottom {
    margin-top: 10px;
    margin-bottom: 30px;
  }

  .feat-card-content {
    padding: 60px 28px;
    position: absolute;
    top: 0;
    left: 0;
    max-width: 400px;

    @media (max-width: ${breakpoints.sm}) {
      padding: 16px;
    }
  }

  .feat-card-img {
    object-position: 93px 90px;
    scale: 2;

    @media (max-width: ${breakpoints.xl}) {
      object-position: 73px 90px;
    }

    @media (max-width: ${breakpoints.sm}) {
      object-position: 0px 90px;
    }
  }

  .feat-link {
    position: relative;
    &::after {
      position: absolute;
      content: "";
      left: 0;
      top: 100%;
      height: 1px;
      width: 100%;
      background-color: ${defaultTheme.color_white};
    }
  }
`;

const Featured: React.FC = () => {
  return (
    <Section>
      <Container>
        <FeaturedContent className="grid">
          {featuredData.map((featured) => (
            <FeaturedCardWrapper className="text-black-60" key={featured.id}>
              <img
                className="object-fit-cover feat-card-img"
                src={featured.imgSource}
                alt={featured.largeText} // Thêm thuộc tính alt cho hình ảnh
              />
              <div className="feat-card-content w-full h-full text-white">
                <p className="feat-text-top text-xxl font-semibold">{featured.topText}</p>
                <h3 className="feat-text-large font-bold">{featured.largeText}</h3>
                <p className="feat-text-bottom font-light text-xl italic uppercase">{featured.bottomText}</p>
                <Link to={featured.buttonLink} className="feat-link font-extrabold text-black-60 text-3xl">
                  {featured.buttonText}
                </Link>
              </div>
            </FeaturedCardWrapper>
          ))}
        </FeaturedContent>
      </Container>
    </Section>
  );
};

export default Featured;
