import Brands from "@components/atom/brand/Brands";
import Catalog from "@components/atom/catalog/Catalog";
import Featured from "@components/atom/featured/Featured";
import Hero from "@components/atom/hero/Hero";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllProduct, getAllProductTopSelling } from "@redux/slices/productSlice";
import { Container, HorizontalLine } from "@styles/styles";
import React, { useEffect } from "react";
import styled from "styled-components";
const HomeScreenWrapper = styled.main``;

function Home() {
  const dispatch = useAppDispatch();
  const listProducts = useAppSelector((state) => state.product.data?.items || []);
  const listProductsTopSelling = useAppSelector((state) => state.product.datatopSelling?.items || []);
  const isLoading = useAppSelector((state) => state.product.isLoading);
  useEffect(() => {
    dispatch(getAllProduct({ page: 1, size: 100 }));
    dispatch(getAllProductTopSelling());
  }, []);
  const role = localStorage.getItem("role");
  if (role === "Admin") {
    window.location.href = "/listUser";
  } else if (role === "Manager") {
    window.location.href = "/dashboard";
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

            <Catalog catalogTitle={"Các sản phẩm bán chạy"} products={listProductsTopSelling.slice(0, 4)} />

            <HorizontalLine />
            <Brands />
          </Container>
        </>
      )}
    </HomeScreenWrapper>
  );
}

export default Home;
