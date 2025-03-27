import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Title from "@common/Title";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { logoutUser } from "@redux/slices/loginSlice";

const NavMenuWrapper = styled.nav`
  margin-top: 32px;

  .nav-menu-list {
    row-gap: 8px;

    @media (max-width: ${breakpoints.md}) {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }

  .nav-menu-item {
    border-radius: 4px;

    @media (max-width: ${breakpoints.sm}) {
      flex: 1 1 0;
    }
  }

  .nav-menu-link {
    padding-left: 36px;
    width: 100%;
    height: 40px;
    column-gap: 12px;
    border: 1px solid transparent;

    &:hover {
      background-color: ${defaultTheme.color_whitesmoke};
    }

    .nav-link-text {
      color: ${defaultTheme.color_gray};
    }

    &.active {
      border-left: 2px solid ${defaultTheme.color_gray};
      background-color: ${defaultTheme.color_whitesmoke};

      @media (max-width: ${breakpoints.md}) {
        border-bottom: 2px solid ${defaultTheme.color_gray};
        border-left: 0;
        background-color: transparent;
      }
    }

    @media (max-width: ${breakpoints.md}) {
      padding-left: 16px;
      padding-right: 16px;
    }

    @media (max-width: ${breakpoints.sm}) {
      padding-left: 8px;
      padding-right: 8px;
      column-gap: 8px;
    }
  }
`;

const UserMenu = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userProfile.user);
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  return (
    <div>
      <Title titleText={("Xin chào " + user?.username) as string} />
      <NavMenuWrapper>
        <ul className="nav-menu-list grid">
          <li className="nav-menu-item">
            <Link
              to="/order"
              className={`nav-menu-link flex items-center ${
                location.pathname === "/order" || location.pathname === "/order_detail" ? "active" : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_orders.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">Đơn hàng</span>
            </Link>
          </li>
          <li className="nav-menu-item"></li>
          <li className="nav-menu-item">
            <Link
              to="/setup-package"
              className={`nav-menu-link flex items-center ${
                location.pathname === "//setup-package" || location.pathname === "/setup-package" ? "active" : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_user.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">Hồ cá của tôi</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/booking-history"
              className={`nav-menu-link flex items-center ${
                location.pathname === "//booking-history" || location.pathname === "/booking-history" ? "active" : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_user.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">Danh sách bảo trì</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/setup-booking"
              className={`nav-menu-link flex items-center ${
                location.pathname === "/setup-booking" || location.pathname === "/setup-booking/add" ? "active" : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_user.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">Đặt lịch</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/account"
              className={`nav-menu-link flex items-center ${
                location.pathname === "/account" || location.pathname === "/account/add" ? "active" : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_user.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">Hồ sơ</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <button onClick={handleLogout} className="nav-menu-link flex items-center">
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_sign_out.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">Đăng xuất</span>
            </button>
          </li>
        </ul>
      </NavMenuWrapper>
    </div>
  );
};

export default UserMenu;
