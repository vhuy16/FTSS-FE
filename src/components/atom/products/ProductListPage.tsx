import styled from 'styled-components';
import ProductItem from './ProductItem';
import { breakpoints } from '@styles/themes/default';
import { Product } from '@redux/slices/productSlice';

type ProductListProps = {
    products: Product[];
};

const ProductListWrapper = styled.div`
    column-gap: 20px;
    row-gap: 40px;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));

    @media (max-width: ${breakpoints.sm}) {
        gap: 12px;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
`;

const ProductListPage: React.FC<ProductListProps> = ({ products }) => {
    return (
        <div>
            <ProductListWrapper className="grid">
                {products?.map((product) => {
                    return <ProductItem key={product.id} product={product} />;
                })}
            </ProductListWrapper>
        </div>
    );
};

export default ProductListPage;
