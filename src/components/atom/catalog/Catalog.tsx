import { Container, Section } from "@styles/styles";
import Title from "@common/Title";
import { Product } from "@redux/slices/productSlice";
import ProductList from "../products/ProductList";

type CatalogProps = {
  catalogTitle: string;
  products: Product[];
};

const Catalog: React.FC<CatalogProps> = ({ catalogTitle, products }) => {
  return (
    <Section>
      <Container>
        <div className="categories-content">
          <Title titleText={catalogTitle} />
          <ProductList products={products} />
        </div>
      </Container>
    </Section>
  );
};

export default Catalog;
