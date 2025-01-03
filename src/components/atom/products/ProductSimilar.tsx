import { Section } from '@styles/styles';
import Title from '@common/Title';
import ProductList from '@components/atom/products/ProductList';

const ProductSimilar = () => {
    return (
        <Section>
            <Title titleText={'Các Sản Phẩm Liên Quan'} />
            {/* <ProductList products={newProducts.slice(0, 4)} /> */}
        </Section>
    );
};

export default ProductSimilar;
