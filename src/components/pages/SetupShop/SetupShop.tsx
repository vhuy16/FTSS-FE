import styled from "styled-components";
import { Container, ContentStylings, Section } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { Link } from "react-router-dom";
import Title from "@common/Title";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import ProductFilter from "@components/atom/products/ProductFilter";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import ProductListPage from "@components/atom/products/ProductListPage";
import PaginationControlled from "@components/atom/pagination/Pagination";
import { useLocation } from "react-router-dom";
import { log } from "console";
import Loading from "@components/atom/Loading/Loading";
import { useEffect, useState } from "react";
import { getAllProduct } from "@redux/slices/productSlice";
import { getSetupPackagesShop } from "@redux/slices/setupSlice";
import SetupListShopPage from "./SetupListShopPage";
import { BannerBox } from "../Setup/SetupStyles";
import banner1 from "@images/aquarium-banner.jpg";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import PaginationSetup from "@components/atom/pagination/PaginationSetup";

// Define breadcrumb type
type BreadcrumbItem = {
  label: string;
  link: string;
};

const ProductsContent = styled.div`
  grid-template-columns: 320px auto;
  margin: 20px 0;

  @media (max-width: ${breakpoints.xl}) {
    grid-template-columns: 260px auto;
  }

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 100%;
    row-gap: 24px;
  }
`;

const ProductsContentLeft = styled.div`
  border: 1px solid rgba(190, 188, 189, 0.4);
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.05) 0 10px 50px;
  overflow: hidden;

  @media (max-width: ${breakpoints.lg}) {
    display: grid;
  }
`;

const ProductsContentRight = styled.div`
  padding: 16px 40px;

  .products-right-top {
    margin-bottom: 40px;
    @media (max-width: ${breakpoints.lg}) {
      margin-bottom: 24px;
    }
    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
      row-gap: 16px;
      align-items: flex-start;
    }
  }

  .products-right-nav {
    column-gap: 16px;
    li {
      a.active {
        color: ${defaultTheme.color_sea_green};
      }
    }
  }

  @media (max-width: ${breakpoints.lg}) {
    padding-left: 12px;
    padding-right: 12px;
  }

  @media (max-width: ${breakpoints.sm}) {
    padding-left: 0;
    padding-right: 0;
  }

  .product-card-list {
    grid-template-columns: repeat(auto-fill, repeat(290px, auto));
  }

  .product-card {
    padding-left: 0;
    padding-right: 0;
  }
`;

const DescriptionContent = styled.div`
  .content-stylings {
    margin-left: 32px;
    @media (max-width: ${breakpoints.sm}) {
      margin-left: 0;
    }
  }
`;

const SetupShop: React.FC = () => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang Chủ", link: "/" },
    { label: "Hồ Cá", link: "/setup-package-shop" },
  ];
  const dispatch = useAppDispatch();
  const listSetupShop = useAppSelector((state) => state.setupPackage.setupPackagesShop?.setupPackages);
  const isLoading = useAppSelector((state) => state.setupPackage.isloadingGetAllPackageShop);
  const location = useLocation();
  const k = location.search;
  const queryString = k.split("?")[1];
  const params = new URLSearchParams(queryString);
  const page = params.get("page") ?? "1";
  const size = params.get("size") ?? "6";

  useEffect(() => {
    dispatch(
      getSetupPackagesShop({
        page: parseInt(page as string),
        size: parseInt(size as string),
      })
    );
  }, [page, size]);

  const filteredSetupShop = listSetupShop?.filter((item) => item.isDelete == false);

  return (
    <main className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <ProductsContent className="grid items-start">
          <ProductsContentLeft>
            <BannerBox>{/* <img src={banner1} alt="Banner hồ cá" /> */}</BannerBox>
          </ProductsContentLeft>
          <ProductsContentRight>
            <div className="products-right-top flex items-center justify-between">
              <h4 className="text-xxl"></h4>
              <ul className="products-right-nav flex items-center justify-end flex-wrap">
                <li>
                  <Link to="/" className="active text-lg font-semibold">
                    Đề xuất
                  </Link>
                </li>
              </ul>
            </div>
            {isLoading ? (
              <Loading></Loading>
            ) : filteredSetupShop && filteredSetupShop.length > 0 ? (
              <SetupListShopPage setups={filteredSetupShop} />
            ) : (
              <div>Không có sản phẩm nào</div>
            )}

            {/* số lượng product hiện ra */}
            <div className="mt-20 flex justify-center">
              <PaginationSetup></PaginationSetup>
            </div>
          </ProductsContentRight>
        </ProductsContent>
      </Container>
    </main>
  );
};

export default SetupShop;
