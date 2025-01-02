import Brands from "@components/atom/brand/Brands";
import Category from "@components/atom/category/Category";
import Featured from "@components/atom/featured/Featured";
import Feedback from "@components/atom/feedback/Feedback";
import Hero from "@components/atom/hero/Hero";
import styled from "styled-components";
const HomeScreenWrapper = styled.main``;

function Home() {
  return (
    <HomeScreenWrapper>
      <Hero />
      <Featured />
      <Category />
      {/* {listPostByDateDesc.length > 0 ? (
        <Catalog catalogTitle={"Các sản phẩm mới"} products={listPostByDateDesc.slice(-8)} />
      ) : (
        <>Loading</>
      )} */}
      <Brands />
      {/* {listPostByDateDesc.length > 0 ? (
        <Catalog catalogTitle={"Các sản phẩm bán chạychạy"} products={listPostByDateDesc.slice(-8)} />
      ) : (
        <>Loading</>
      )} */}
      <Feedback />
    </HomeScreenWrapper>
  );
}

export default Home;
