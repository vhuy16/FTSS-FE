import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { commonCardStyles } from '@styles/card';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import { Product } from '@redux/slices/productSlice';
import { useDispatch } from 'react-redux';
// import { addItemWishList } from '@redux/slices/wishlistSlice';
import { currencyFormat } from '@ultils/helper';
import { toast } from 'react-toastify';

interface ProductItemProps {
    product: Product;
}
const ProductTitle = styled.p`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
`;

const ProductCardWrapper = styled.div`
    ${commonCardStyles}
    @media(max-width: ${breakpoints.sm}) {
        padding-left: 0;
        padding-right: 0;
    }

    .product-img {
        height: 270px;
        position: relative;

        @media (max-width: ${breakpoints.sm}) {
            height: 320px;
        }
    }

    .product-wishlist-icon {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 32px;
        height: 32px;
        border-radius: 100%;

        &:hover {
            background-color: ${defaultTheme.color_yellow};
            color: ${defaultTheme.color_white};
        }
    }
`;

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <ProductCardWrapper
            key={product.id}
            onClick={() => {
                if (product.status === 'Available') {
                    navigate(`/product/${product.id}`);
                } else {
                    toast.error('Sản Phẩm Đã Dừng Hoạt Động');
                }
            }}
        >
            <div className="product-img">
                <img className="object-fit-cover" src={product.images[0]} alt="Ảnh sản phẩm" />
            </div>
            <div className="product-info">
                <ProductTitle className="font-normal">{product.productName}</ProductTitle>
                <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-gray" style={{ color: 'gray' }}>
                        {product.categoryName}
                    </span>
                    <span className="text-outerspace font-bold text-red" style={{ color: 'red' }}>
                        {product.status === 'Available'
                            ? `${currencyFormat(product.price)}`
                            : 'Sản phẩm đã dừng hoạt động'}
                    </span>
                </div>
            </div>
        </ProductCardWrapper>
    );
};

export default ProductItem;
