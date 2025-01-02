import Title from "@common/Title";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllCategory } from "@redux/slices/categorySlice";
import { Container, Section, TitleWrapper } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledSectionTitle = styled(TitleWrapper)`
  padding-left: 0;
  &::after {
    display: none;
  }

  @media (max-width: ${breakpoints.sm}) {
    margin-bottom: 20px;
  }
`;

const BrandsContent = styled.div`
  border-radius: 12px;
  padding: 40px 0;

  @media (max-width: ${breakpoints.lg}) {
    padding: 24px 0;
  }
`;

const BrandsListWrapper = styled.div`
  padding: 12px;
  margin-top: 40px;
  gap: 24px;

  @media (max-width: ${breakpoints.sm}) {
    gap: 12px;
    margin-top: 20px;
  }
`;

const BrandsItemWrapper = styled.div`
  width: 178px;
  height: 80px;
  border-radius: 12px;
  background-color: ${defaultTheme.color_white};
  padding: 16px;

  img {
    width: auto;
  }

  @media (max-width: ${breakpoints.sm}) {
    width: 120px;
    border-radius: 8px;
  }

  @media (max-width: ${breakpoints.xs}) {
    width: 80px;
    height: 50px;
    border-radius: 4px;
  }
`;

const Brands = () => {
  const dispatch = useAppDispatch();
  const listCategory = useAppSelector((state) => state.category.categories);
  useEffect(() => {
    dispatch(getAllCategory());
  }, []);
  const navigate = useNavigate();
  return (
    <Section>
      <Container>
        <BrandsContent className="bg-outerspace">
          <StyledSectionTitle className="text-white text-center justify-center flex-col">
            <h3>Các loại mặt hàng nổi bật</h3>
            <p className="text-xxl text-white">
              Chúng tôi có những ưu đãi <span className="text-yellow">đặc biệt</span> cho những khách hàng mới.
            </p>
          </StyledSectionTitle>
          <BrandsListWrapper className="flex items-center flex-wrap justify-center">
            {listCategory?.map((categories) => {
              return (
                <BrandsItemWrapper className="flex items-center justify-center" key={categories.id}>
                  {categories.categoryName}
                </BrandsItemWrapper>
              );
            })}
          </BrandsListWrapper>
        </BrandsContent>
      </Container>
    </Section>
  );
};

export default Brands;
