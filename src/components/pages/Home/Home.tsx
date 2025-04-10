import Brands from "@components/atom/brand/Brands";
import Catalog from "@components/atom/catalog/Catalog";
import Category from "@components/atom/category/Category";
import Featured from "@components/atom/featured/Featured";
import Feedback from "@components/atom/feedback/Feedback";
import Hero from "@components/atom/hero/Hero";
import Loading from "@components/atom/Loading/Loading";
import LoadingPage from "@components/atom/Loading/LoadingPage";
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
  const isLoading = useAppSelector((state) => state.product.isLoading);
  useEffect(() => {
    dispatch(getAllProduct({ page: 1, size: 100 }));
  }, []);
  const role = localStorage.getItem("role");
  if (role === "Admin") {
    window.location.href = "/dashboard";
  } else if (role === "Manager") {
    window.location.href = "/listOrder";
  }

  return (
    <HomeScreenWrapper>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <Hero />
          <Featured />
          <Container>
            <Catalog catalogTitle={"Các sản phẩm mới"} products={listProducts.slice(-4)} />

            <HorizontalLine />

            <Catalog catalogTitle={"Các sản phẩm bán chạy"} products={listProducts.slice(2, 6)} />

            <HorizontalLine />
            <Brands />
          </Container>
        </>
      )}
    </HomeScreenWrapper>
  );
}

export default Home;
