import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { SiteBrandWrapper } from "@styles/header";
// import { staticImages } from "../../utils/images";
import { Input, InputGroupWrapper } from "@styles/form";
// import { sideMenuData } from "../../data/data";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import souvi from "@images/logo.png";
import { sideMenuData } from "./data";
import { selectIsSidebarOpen, toggleSidebar } from "@redux/slices/sidebarSlice";
import { RootState } from "@redux/store"; // Đảm bảo đã import đúng kiểu RootState
import { changeSearchValue } from "@redux/slices/searchSlice";
import { useEffect, useRef } from "react";
// Styled Components
const SideNavigationWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  z-index: 999;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  padding: 16px;
  transform: translateX(-100%);
  transition: ${defaultTheme.default_transition};

  &.show {
    transform: translateX(0);
  }

  .sidebar-close-btn {
    position: absolute;
    right: 16px;
    top: 16px;
    &:hover {
      color: ${defaultTheme.color_sea_green};
    }
  }

  .sidenav-search-form {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-top: 20px;

    .input-group {
      min-width: 100%;
      column-gap: 0;
    }
  }

  .sidenav-menu-list {
    gap: 14px;
    margin: 20px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 24px 0;

    li {
      padding: 5px 5px 5px 12px;
      border-radius: 4px;
      transition: ${defaultTheme.default_transition};

      &:hover {
        background: rgba(0, 0, 0, 0.05);

        a {
          span {
            color: ${defaultTheme.color_sea_green};
          }
        }
      }
    }

    a {
      column-gap: 16px;
      &.active {
        color: ${defaultTheme.color_sea_green};
      }
    }
  }

  @media (max-width: ${breakpoints.xs}) {
    width: 100%;
  }
`;

// TypeScript Component
const Sidebar: React.FC = () => {
  const location = useLocation();
  const isSidebarOpen = useAppSelector((state: RootState) => selectIsSidebarOpen(state));
  const dispatch = useAppDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Đóng sidebar khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        dispatch(toggleSidebar());
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, dispatch]);

  return (
    <SideNavigationWrapper ref={sidebarRef} className={`bg-white h-full ${isSidebarOpen ? "show" : ""}`}>
      <button className="sidebar-close-btn text-3xl" onClick={() => dispatch(toggleSidebar())}>
        <i className="bi bi-x-square"></i>
      </button>
      <div className="sidenav-head">
        <SiteBrandWrapper to="/" className="inline-flex">
          <div className="brand-img-wrap flex items-center justify-center">
            <img className="site-brand-img" src={souvi} alt="Logo" />
          </div>
          <span className="site-brand-text text-outerspace">FTSS</span>
        </SiteBrandWrapper>
        <form className="sidenav-search-form">
          <InputGroupWrapper className="input-group">
            <span className="input-icon flex items-center justify-center text-xl text-gray">
              <i className="bi bi-search"></i>
            </span>
            <Input type="text" className="input-control w-full" placeholder="Search" />
          </InputGroupWrapper>
        </form>
        <ul className="sidenav-menu-list grid">
          {sideMenuData?.map((menu) => (
            <li
              key={menu.id}
              onClick={() => {
                dispatch(changeSearchValue(""));
              }}
            >
              <Link
                to={menu.menuLink}
                className={`flex items-center text-gray ${location.pathname === menu.menuLink ? "active" : ""}`}
              >
                <span className="text-xxl">
                  <i className={`bi bi-${menu.iconName}`}></i>
                </span>
                <span className="text-lg font-medium">{menu.menuText}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SideNavigationWrapper>
  );
};

export default Sidebar;
