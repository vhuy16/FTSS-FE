import Brands from "@components/atom/brand/Brands";
import Catalog from "@components/atom/catalog/Catalog";
import Category from "@components/atom/category/Category";
import Featured from "@components/atom/featured/Featured";
import Feedback from "@components/atom/feedback/Feedback";
import Hero from "@components/atom/hero/Hero";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllProduct } from "@redux/slices/productSlice";
import { getUserProfile } from "@redux/slices/userSlice";
import { Container, HorizontalLine } from "@styles/styles";
import React, { useEffect } from "react";
import styled from "styled-components";
const HomeScreenWrapper = styled.main``;

function Home() {
  const dispatch = useAppDispatch();
  const listProducts = useAppSelector((state) => state.product.data?.items || []);
  useEffect(() => {
    dispatch(getAllProduct({ page: 1, size: 100 }));
  }, []);

  return (
    <HomeScreenWrapper>
      <Hero />
      <Featured />
      <Container>
        {listProducts.length > 0 ? (
          <Catalog catalogTitle={"Các sản phẩm mới"} products={listProducts.slice(-4)} />
        ) : (
          <>Loading</>
        )}
        <HorizontalLine />

        {listProducts.length > 0 ? (
          <Catalog catalogTitle={"Các Sản Phẩm Bán Chạy"} products={listProducts.slice(2, 6)} />
        ) : (
          <>Loading</>
        )}
        <HorizontalLine />
        <Brands />
        <Feedback />
      </Container>
    </HomeScreenWrapper>
  );
}

export default Home;
