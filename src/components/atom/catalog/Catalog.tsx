import styled from "styled-components";
import { Container, Section } from "@styles/styles";
import Title from "@common/Title";
import { Product } from "@redux/slices/productSlice";
import ProductList from "../products/ProductList";
import { defaultTheme } from "@styles/themes/default";
import { useNavigate } from "react-router-dom";

type CatalogProps = {
  catalogTitle: string;
  products: Product[];
};

const Catalog: React.FC<CatalogProps> = ({ catalogTitle, products }) => {
  const navigate = useNavigate();
  return (
    <CatalogSection>
      <Container>
        <CatalogHeader>
          <Title titleText={catalogTitle} />
        </CatalogHeader>
        <ProductList products={products} />
        <ViewAllWrapper>
          <ViewAllButton onClick={() => navigate("/product")}>Xem tất cả</ViewAllButton>
        </ViewAllWrapper>
      </Container>
    </CatalogSection>
  );
};

export default Catalog;

const CatalogSection = styled(Section)`
  padding: 50px 0;
`;

const CatalogHeader = styled.div`
  margin-bottom: 88px;
  margin-top: 50px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 48px;
    font-weight: 900;
    position: relative;
    display: inline-block;
    margin: 0 auto;
    font-family: "Inter", sans-serif;
    line-height: 58.09px;
  }
`;

const ViewAllWrapper = styled.div`
  margin-top: 88px;
  display: flex;
  justify-content: center;
`;

const ViewAllButton = styled.button`
  padding: 16px 54px;
  border: 1px solid #10ac97;
  background: transparent;
  border-radius: 63px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: ${defaultTheme.default_transition};

  &:hover {
    background: #10ac97;
    color: #fff;
  }
`;
