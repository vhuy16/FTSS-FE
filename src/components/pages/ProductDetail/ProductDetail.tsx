import styled from 'styled-components';
import { Container } from '@styles/styles';
import Breadcrumb from '@common/Breadcrumb';
import { product_one } from './data';
import ProductPreview from '@components/atom/products/ProductPreview';
import { Link, useParams } from 'react-router-dom';
import { BaseBtnGreen } from '@styles/button';
import { breakpoints, defaultTheme } from '@styles/themes/default';
import ProductDescriptionTab from '@components/atom/products/ProductDescriptionTab';
import ProductSimilar from '@components/atom/products/ProductSimilar';
import ProductServices from '@components/atom/products/ProductServices';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { addItem } from '@redux/slices/cartSlice';
import { useEffect } from 'react';
import { getProductDetail } from '@redux/slices/productDetailSlice';
import { currencyFormat } from '@ultils/helper';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '@components/atom/Loading/Loading';

const DetailsScreenWrapper = styled.main`
    margin: 40px 0;
`;

const DetailsContent = styled.div`
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;

    @media (max-width: ${breakpoints.xl}) {
        gap: 24px;
        grid-template-columns: 3fr 2fr;
    }

    @media (max-width: ${breakpoints.lg}) {
        grid-template-columns: 100%;
    }
`;

const ProductDetailsWrapper = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 24px;

    @media (max-width: ${breakpoints.sm}) {
        padding: 16px;
    }

    @media (max-width: ${breakpoints.xs}) {
        padding: 12px;
    }

    .prod-title {
        margin-bottom: 10px;
    }
    .rating-and-comments {
        column-gap: 16px;
        margin-bottom: 20px;
    }
    .prod-rating {
        column-gap: 10px;
    }
    .prod-comments {
        column-gap: 10px;
    }
    .prod-add-btn {
        min-width: 160px;
        column-gap: 8px;
        &-text {
            margin-top: 2px;
        }
    }

    .btn-and-price {
        margin-top: 36px;
        column-gap: 16px;
        row-gap: 10px;

        @media (max-width: ${breakpoints.sm}) {
            margin-top: 24px;
        }
    }
`;

const ProductSizeWrapper = styled.div`
    .prod-size-top {
        gap: 20px;
    }
    .prod-size-list {
        gap: 12px;
        margin-top: 16px;
        @media (max-width: ${breakpoints.sm}) {
            gap: 8px;
        }
    }

    .prod-size-item {
        position: relative;
        height: 38px;
        width: 38px;
        cursor: pointer;

        @media (max-width: ${breakpoints.sm}) {
            width: 32px;
            height: 32px;
        }

        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 38px;
            height: 38px;
            opacity: 0;
            cursor: pointer;

            @media (max-width: ${breakpoints.sm}) {
                width: 32px;
                height: 32px;
            }

            &:checked + span {
                color: ${defaultTheme.color_white};
                background-color: ${defaultTheme.color_outerspace};
                border-color: ${defaultTheme.color_outerspace};
            }
        }

        span {
            width: 38px;
            height: 38px;
            border-radius: 8px;
            border: 1.5px solid ${defaultTheme.color_silver};
            text-transform: uppercase;

            @media (max-width: ${breakpoints.sm}) {
                width: 32px;
                height: 32px;
            }
        }
    }
`;

const ProductColorWrapper = styled.div`
    margin-top: 32px;

    @media (max-width: ${breakpoints.sm}) {
        margin-top: 24px;
    }

    .prod-colors-top {
        margin-bottom: 16px;
    }

    .prod-colors-list {
        column-gap: 12px;
    }

    .prod-colors-item {
        position: relative;
        width: 22px;
        height: 22px;
        transition: ${defaultTheme.default_transition};

        &:hover {
            scale: 0.9;
        }

        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 22px;
            height: 22px;
            opacity: 0;
            cursor: pointer;

            &:checked + span {
                outline: 1px solid ${defaultTheme.color_gray};
                outline-offset: 3px;
            }
        }

        .prod-colorbox {
            border-radius: 100%;
            width: 22px;
            height: 22px;
            display: inline-block;
        }
    }
`;

const ProductDetailsScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const product = useAppSelector((state) => state.productDetail.data);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getProductDetail(id as string));
    }, []);

    const stars = Array.from({ length: 5 }, (_, index) => (
        <span
            key={index}
            className={`text-yellow ${
                index < Math.floor(product_one.rating)
                    ? 'bi bi-star-fill'
                    : index + 0.5 === product_one.rating
                    ? 'bi bi-star-half'
                    : 'bi bi-star'
            }`}
        ></span>
    ));

    const breadcrumbItems = [
        { label: 'Trang chủ', link: '/' },
        { label: 'Sản phẩm', link: '/product' },
        { label: `${product?.categoryName}`, link: '' },
    ];

    return (
        <DetailsScreenWrapper>
            <Container>
                <Breadcrumb items={breadcrumbItems} />
                <DetailsContent className="grid">
                    {product ? <ProductPreview product={product} /> : <Loading></Loading>}
                    {product ? (
                        <ProductDetailsWrapper>
                            <h2 className="prod-title font-bold text-2xl">{product?.productName}</h2>
                            <div className="flex items-center rating-and-comments flex-wrap">
                                <div className="prod-rating flex items-center text-yellow">
                                    {stars}
                                    {/* <span className="text-gray text-xs"></span> */}
                                </div>
                                <div className="prod-comments flex items-start">
                                    <span className="prod-comment-icon text-gray">
                                        <i className="bi bi-chat-left-text"></i>
                                    </span>
                                    <span className="prod-comment-text text-sm text-gray">{10} comment(s)</span>
                                </div>
                            </div>
                            <ProductSizeWrapper>
                                <div className="prod-size-top flex items-center flex-wrap">
                                    <p className="text-sm font-semibold text-outerspace">
                                        Mô Tả: {product.description}
                                    </p>
                                </div>
                            </ProductSizeWrapper>

                            <p className="text-sm font-semibold text-outerspace mt-4">
                                Số Lượng Sản Phẩm Khả Dụng:
                                <span className="text-sm text-gray font-thin"> {product.quantity} Sản Phẩm</span>
                            </p>
                            {product.quantity === 0 || product.status !== 'Available' ? (
                                <div className="prod-price text-xl font-bold text-outerspace text-red-500 mt-4">
                                    Ngừng Hoạt Động
                                </div>
                            ) : (
                                <div className="btn-and-price flex items-center flex-wrap">
                                    <BaseBtnGreen
                                        as={BaseBtnGreen}
                                        className="prod-add-btn"
                                        onClick={() => {
                                            const token = localStorage.getItem('access_token');
                                            if (token) {
                                                dispatch(addItem({ productId: product.id, quantity: 1 }));
                                                toast.success('Thêm Sản Phẩm Vào Giỏ Hàng Thành Công');
                                            } else {
                                                toast.warning('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
                                                setTimeout(() => {
                                                    window.location.href = '/login';
                                                }, 1000);
                                            }
                                        }}
                                    >
                                        <span className="prod-add-btn-icon">
                                            <i className="bi bi-cart2"></i>
                                        </span>
                                        <span className="prod-add-btn-text">Thêm vào giỏ hàng</span>
                                    </BaseBtnGreen>
                                    <span className="prod-price text-xl font-bold text-outerspace text-red-500">
                                        {currencyFormat(product.price)}
                                    </span>
                                </div>
                            )}

                            <ProductServices />
                        </ProductDetailsWrapper>
                    ) : (
                        <Loading></Loading>
                    )}
                </DetailsContent>
                <ProductDescriptionTab product={product} />
                <ProductSimilar />
            </Container>
        </DetailsScreenWrapper>
    );
};

export default ProductDetailsScreen;
