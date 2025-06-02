import React, { useEffect, useState } from "react";
import { FaCalendar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { formatDate } from "@ultils/helper";
import { getDetailIssue } from "@redux/slices/issueSlice";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import Title from "@common/Title";
import { HorizontalLine, Section } from "@styles/styles";
import styled from "styled-components";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { commonCardStyles } from "@styles/card";
import DOMPurify from "dompurify";
const ProductListWrapper = styled.div`
  column-gap: 20px;
  row-gap: 40px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));

  @media (max-width: ${breakpoints.sm}) {
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;
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
    height: 290px;
    position: relative;
    border-radius: 10%;

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
const IssueBlogDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const issueDetail = useAppSelector((state) => state.issue.issueDetail);
  const isLoadingDetail = useAppSelector((state) => state.issue.isLoading);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getDetailIssue(id as string));
  }, [dispatch, id]);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {isLoadingDetail ? (
        <LoadingPage />
      ) : (
        <article className="min-h-screen bg-gray-50">
          <div className="relative h-[60vh] w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
            <img
              src={issueDetail?.issueImage}
              alt="Header"
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-20">
              <div className="max-w-4xl mx-auto mb-10">
                <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 transition-all duration-300">
                  {issueDetail?.title}
                </h1>
                <div className="flex items-center space-x-6 text-gray-200">
                  <div className="flex items-center">
                    <div className="text-xl bg-gray-100 inline-block px-8 py-2 rounded-2xl">
                      {issueDetail?.issueCategoryName}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    <span>{issueDetail?.modifiedDate ? formatDate(issueDetail.modifiedDate) : "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-3 py-12">
            {issueDetail?.solutions.map((solution, index) => (
              <div key={solution.id} className="mb-10">
                <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-all">
                  {solution.solutionName}
                </h2>
                {/* Render HTML từ backend */}
                <div
                  className="prose prose-li:marker:text-gray-500 prose-ol:list-decimal prose-ul:list-disc max-w-none"
                  dangerouslySetInnerHTML={{ __html: solution.description }}
                />
                <HorizontalLine />
                <Section>
                  <Title titleText={"Các sản phẩm gợi ý"} />
                  <ProductListWrapper className="grid">
                    {solution.products?.map((product) => (
                      <ProductCardWrapper
                        key={product.productId}
                        onClick={() => {
                          navigate(`/product/${product.productId}`);
                        }}
                      >
                        <div className="product-img">
                          <img className="object-fit-cover" src={product.productImageUrl} alt="Ảnh sản phẩm" />
                        </div>
                        <div className="product-info">
                          <ProductTitle className="font-normal">{product.productName}</ProductTitle>
                        </div>
                      </ProductCardWrapper>
                    ))}
                  </ProductListWrapper>
                </Section>
              </div>
            ))}
          </div>
        </article>
      )}
    </>
  );
};

export default IssueBlogDetail;
