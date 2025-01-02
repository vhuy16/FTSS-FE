import Brands from "@components/atom/brand/Brands";
import Catalog from "@components/atom/catalog/Catalog";
import Category from "@components/atom/category/Category";
import Featured from "@components/atom/featured/Featured";
import Feedback from "@components/atom/feedback/Feedback";
import Hero from "@components/atom/hero/Hero";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllProduct } from "@redux/slices/productSlice";
import React, { useEffect } from "react";
import styled from "styled-components";
const HomeScreenWrapper = styled.main``;

function Home() {
  const [page, setPage] = React.useState(1);
  const dispatch = useAppDispatch();
  const listProducts = useAppSelector((state) => state.product.data?.items || []);
  useEffect(() => {
    dispatch(getAllProduct({ page: page, size: 100 }));
  }, [dispatch, page]);

  return (
    <HomeScreenWrapper>
      <Hero />
      <Featured />
      <Category />
      {listProducts.length > 0 ? (
        <Catalog catalogTitle={"Các sản phẩm mới"} products={listProducts.slice(-8)} />
      ) : (
        <>Loading</>
      )}
      <Brands />
      {listProducts.length > 0 ? (
        <Catalog catalogTitle={"Các Sản Phẩm Bán Chạy"} products={listProducts.slice(0, 2)} />
      ) : (
        <>Loading</>
      )}
      <Feedback />
    </HomeScreenWrapper>
  );
}

export default Home;
