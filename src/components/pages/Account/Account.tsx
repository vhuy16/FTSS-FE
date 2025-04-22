import styled from "styled-components";
import { Container } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "@styles/user";
import UserMenu from "@atom/user/UserMenu";
import Title from "@common/Title";
import { FormElement, Input } from "@styles/form";
import { BaseBtnGreen, BaseButton, BaseButtonOuterspace, BaseLinkGreen } from "@styles/button";
import { Link } from "react-router-dom";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { useCallback, useEffect, useState } from "react";
import { getUserProfile } from "@redux/slices/userSlice";
import LoadingPage from "@components/atom/Loading/LoadingPage";
import PageBreadcrumb from "@common/PageBreadCrumb";
import AccountInfoCard from "./AccountInfoCard";
import { AddBankAccountModal } from "@components/atom/modal/AddBankAccountModal";
import { UpdateBankAccountModal } from "@components/atom/modal/UpdateBankAccountModal";

const AccountScreenWrapper = styled.main`
  .address-list {
    margin-top: 20px;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;

    @media (max-width: ${breakpoints.lg}) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .address-item {
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 25px;
    row-gap: 8px;
  }

  .address-tags {
    gap: 12px;

    li {
      height: 28px;
      border-radius: 8px;
      padding: 2px 12px;
      background-color: ${defaultTheme.color_whitesmoke};
    }
  }

  .address-btns {
    margin-top: 12px;
    .btn-separator {
      width: 1px;
      border-radius: 50px;
      background: ${defaultTheme.color_platinum};
      margin: 0 10px;
    }
  }
`;

const breadcrumbItems = [
  {
    label: "Trang chủ",
    link: "/",
  },
  { label: "Hồ sơ", link: "/account" },
];

const Account = () => {
  const user = useAppSelector((state) => state.userProfile.user);
  const isLoadingUser = useAppSelector((state) => state.userProfile.isLoading);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUserProfile());
  }, []);
  // bank
  const openModal = () => {
    setshowBankAccountModal(true);
  };
  const closeModal = useCallback(() => {
    setshowBankAccountModal(false);
  }, []);
  const [showBankAccountModal, setshowBankAccountModal] = useState(false);
  //update bank
  // bank
  const openUpdateModal = () => {
    setshowUpdateBankAccountModal(true);
  };
  const closeUpdateModal = useCallback(() => {
    setshowUpdateBankAccountModal(false);
  }, []);
  const [showUpdateBankAccountModal, setshowUpdateBankAccountModal] = useState(false);
  return (
    <AccountScreenWrapper className="page-py-spacing">
      {isLoadingUser ? (
        <LoadingPage />
      ) : (
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <UserDashboardWrapper>
            <UserMenu />
            <UserContent>
              <AccountInfoCard />
              {user?.bankName && user?.bankHolder && user?.bankNumber === null ? (
                <div className="flex mt-4 mb-4">
                  <BaseBtnGreen type="submit" onClick={openModal}>
                    Thêm tài khoản ngân hàng
                  </BaseBtnGreen>
                </div>
              ) : (
                <></>
              )}
              {user?.bankName && user?.bankHolder && user?.bankNumber ? (
                <div>
                  <h4 className="title-sm">Tài khoản ngân hàng</h4>
                  <div className="address-list grid">
                    <div className="address-item grid">
                      <div className="flex items-center gap-3">
                        <p className="text-outerspace text-xl font-semibold address-title">Ngân hàng:</p>
                        <p className="text-outerspace text-lg">{user?.bankName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-outerspace text-xl font-semibold address-title">Số tài khoản:</p>
                        <p className="text-outerspace text-lg">{user?.bankNumber}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-outerspace text-xl font-semibold address-title">Tên tài khoản:</p>
                        <p className="text-outerspace text-lg">{user?.bankHolder}</p>
                      </div>
                      <ul className="address-tags flex flex-wrap mt-3">
                        <li className="text-gray text-base font-medium inline-flex items-center justify-center">
                          Địa chỉ ngân hàng mặc định
                        </li>
                      </ul>
                      <div className="address-btns">
                        <BaseButton className="text-base text-outerspace font-semibold" onClick={openUpdateModal}>
                          Chỉnh Sửa
                        </BaseButton>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <AddBankAccountModal isOpen={showBankAccountModal} onClose={closeModal} />
              <UpdateBankAccountModal isOpen={showUpdateBankAccountModal} onClose={closeUpdateModal} />
            </UserContent>
          </UserDashboardWrapper>
        </Container>
      )}
    </AccountScreenWrapper>
  );
};

export default Account;
