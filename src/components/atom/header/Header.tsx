import styled from "styled-components";
import { HeaderMainWrapper, SiteBrandWrapper } from "@styles/header";
import { Container } from "@styles/styles";
// import { navMenuData } from "../../data/data";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Input, InputGroupWrapper } from "@styles/form";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@redux/slices/sidebarSlice";
import logo from "@images/logo2.png";
import heart from "@icons/heart.svg";
import user from "@icons/user.svg";
import cart from "@icons/cart.svg";
import login from "@icons/login.svg";
import { BaseLinkGreen, BaseLinkOutlineDark } from "@styles/button";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { changeSearchValue } from "@redux/slices/searchSlice";
import UserDropdown from "./UserDropdown";
import CustomerDropDown from "./CustomerDropDown";
import { getProductByNameForUser } from "@redux/slices/productSlice";
import { CartItem, getAllCart } from "@redux/slices/cartSlice";

const NavigationAndSearchWrapper = styled.div`
  column-gap: 20px;
  .search-form {
    @media (max-width: ${breakpoints.lg}) {
      width: 100%;
      max-width: 500px;
    }
    @media (max-width: ${breakpoints.sm}) {
      display: none;
    }
  }

  .input-group {
    min-width: 320px;

    .input-control {
      @media (max-width: ${breakpoints.sm}) {
        display: none;
      }
    }

    @media (max-width: ${breakpoints.xl}) {
      min-width: 160px;
    }

    @media (max-width: ${breakpoints.sm}) {
      min-width: auto;
      grid-template-columns: 100%;
    }
  }

  @media (max-width: ${breakpoints.lg}) {
    width: 100%;
    justify-content: flex-end;
  }
`;
const ButtonGroupWrapper = styled.div`
  gap: 8px;
  background-color: #10b9b0;
  @media (max-width: ${breakpoints.sm}) {
    button,
    a {
      min-width: 100px;
    }
  }
`;

const NavigationMenuWrapper = styled.nav`
  .nav-menu-list {
    margin-left: 20px;

    @media (max-width: ${breakpoints.lg}) {
      flex-direction: column;
    }
  }

  .nav-menu-item {
    margin-right: 20px;
    margin-left: 20px;

    @media (max-width: ${breakpoints.xl}) {
      margin-left: 16px;
      margin-right: 16px;
    }
  }

  .nav-menu-link {
    &.active {
      color: ${defaultTheme.color_outerspace};
      font-weight: 700;
    }

    &:hover {
      color: ${defaultTheme.color_outerspace};
    }
  }

  @media (max-width: ${breakpoints.lg}) {
    position: absolute;
    top: 0;
    right: 0;
    width: 260px;
    background: ${defaultTheme.color_white};
    height: 100%;
    z-index: 999;
    display: none;
  }
`;

const IconLinksWrapper = styled.div`
  column-gap: 18px;
  .icon-link {
    width: 48px;
    height: 48px;
    border-radius: 6px;

    &.active {
      background-color: ${defaultTheme.color_sea_green};
      img {
        filter: brightness(100);
      }
    }

    &:hover {
      background-color: ${defaultTheme.color_whitesmoke};
    }
  }

  @media (max-width: ${breakpoints.xl}) {
    column-gap: 8px;
  }

  @media (max-width: ${breakpoints.xl}) {
    column-gap: 6px;
  }
`;

const Header = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault(); // k cho form refresh trang
    const searchQuery = (event.target as HTMLFormElement).search.value; // Lấy input

    if (searchQuery) {
      navigate(`/product?productName=${searchQuery}`); // Cập nhật URL với tham số productName
    }
  };
  useEffect(() => {
    if (token) {
      dispatch(getAllCart());
    }
  }, [dispatch]);
  const listCart: CartItem[] = useAppSelector((state) => state.cart.items);
  const OddCart = Array.isArray(listCart) ? listCart.filter((item) => item.status === "Odd") : 0;
  const oddItemCount = Array.isArray(OddCart) ? OddCart.reduce((total, item) => total + item.quantity, 0) : 0;
  return (
    <HeaderMainWrapper className="header flex items-center">
      <Container className="container">
        <div className="header-wrap flex items-center justify-between">
          <div className="flex items-center">
            <button type="button" className="sidebar-toggler" onClick={() => dispatch(toggleSidebar())}>
              <i className="bi bi-list"></i>
            </button>
            <SiteBrandWrapper to="/" className="inline-flex">
              <div className="brand-img-wrap flex items-center justify-center">
                <img className="site-brand-img" src={logo} alt="site logo" />
              </div>
              <span className="site-brand-text text-outerspace">FTSS</span>
            </SiteBrandWrapper>
          </div>
          <NavigationAndSearchWrapper className="flex items-center">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center search-form mx-auto w-[300px] md:w-[400px] lg:w-[500px]"
            >
              {/* Icon  */}
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                name="search"
                placeholder="Tìm kiếm sản phẩm"
                autoComplete="off"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-10 text-sm text-gray-800 shadow focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
              />
            </form>
          </NavigationAndSearchWrapper>

          <IconLinksWrapper className="flex items-center  ">
            {token && (
              <Link
                to="/cart"
                className={`icon-link ${
                  location.pathname === "/cart" ? "active" : ""
                } inline-flex items-center justify-center `}
              >
                <div className="relative">
                  <img src={cart} alt="" className="w-6 h-6" />
                  {oddItemCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {oddItemCount}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {token && (
              <div className="flex items-center gap-1 2xsm:gap-3">
                <Link
                  to="/account"
                  className={`icon-link ${
                    location.pathname === "/account" || location.pathname === "/account/add" ? "active" : ""
                  } inline-flex items-center justify-center`}
                >
                  <img src={user} alt="" className="w-6 h-6" />
                </Link>
                <CustomerDropDown />
              </div>
            )}

            {!token && (
              <Link
                to="/login"
                className={`icon-link ${
                  location.pathname === "/login" ? "active" : ""
                } inline-flex items-center justify-center`}
              >
                <ButtonGroupWrapper className="flex items-center ml-12">
                  <BaseLinkGreen to="/login">Đăng nhập</BaseLinkGreen>
                </ButtonGroupWrapper>
              </Link>
            )}
          </IconLinksWrapper>
        </div>
      </Container>
    </HeaderMainWrapper>
  );
};

export default Header;
