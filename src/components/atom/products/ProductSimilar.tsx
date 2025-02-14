import { Section } from '@styles/styles';
import Title from '@common/Title';
import ProductList from '@components/atom/products/ProductList';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { useEffect } from 'react';
import { getAllProductSimilar } from '@redux/slices/productSlice';
import { useParams } from 'react-router-dom';

const ProductSimilar = () => {
    const product = useAppSelector((state) => state.productDetail.data);
    const listProduct = useAppSelector((state) => state.product.data?.items);

    let listProductSimilar;
    if (product) {
        listProductSimilar = listProduct?.filter((p) => p.id !== product.id);
    }
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllProductSimilar(product?.categoryName as string));
    }, [product]);
    return (
        <Section>
            <Title titleText={'Các sản phẩm liên quan'} />
            {Array.isArray(listProductSimilar) && listProductSimilar.length > 0 ? (
                <ProductList products={listProductSimilar} />
            ) : (
                <>Không có sản phẩm nào</>
            )}
        </Section>
    );
};

export default ProductSimilar;
