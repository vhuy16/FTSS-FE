import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getSetupPackagesShop } from "@redux/slices/setupSlice";
import { Container, Section, TitleWrapper } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CatalogSetup from "../catalog/CatalogSetup";
import Loading from "../Loading/Loading";

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
  background-color: ${defaultTheme.color_lighwhite};
  @media (max-width: ${breakpoints.lg}) {
    padding: 24px 0;
  }
`;

const BrandsListWrapper = styled.div`
  padding: 12px;
  margin-top: 20px;
  gap: 24px;
  @media (max-width: ${breakpoints.sm}) {
    gap: 12px;
    margin-top: 20px;
  }
`;

const Brands = () => {
  const dispatch = useAppDispatch();
  const listSetup = useAppSelector((state) => state.setupPackage.setupPackages);
  useEffect(() => {
    dispatch(getSetupPackagesShop());
  }, []);
  const navigate = useNavigate();
  return (
    <Section>
      <Container>
        <BrandsContent>
          <StyledSectionTitle className=" text-center justify-center flex-col">
            <h3>Các loại hồ cá nổi bật</h3>
            <p className="text-xxl ">
              Chúng tôi có những ưu đãi <span className="text-yellow">đặc biệt</span> cho những khách hàng mới.
            </p>
          </StyledSectionTitle>
          <BrandsListWrapper>
            {listSetup.length > 0 ? <CatalogSetup setups={listSetup.slice(0, 3)} /> : <Loading></Loading>}
          </BrandsListWrapper>
        </BrandsContent>
      </Container>
    </Section>
  );
};

export default Brands;
