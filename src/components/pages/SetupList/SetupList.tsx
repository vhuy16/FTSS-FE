import Breadcrumb from "@common/Breadcrumb";
import Title from "@common/Title";
import UserMenu from "@components/atom/user/UserMenu";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { deleteSetup, getSetupPackages } from "@redux/slices/setupSlice";
import { BaseBtnGreen, BaseLinkBlack } from "@styles/button";
import { Container } from "@styles/styles";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import { UserContent, UserDashboardWrapper } from "@styles/user";
import { currencyFormat, formatDate } from "@ultils/helper";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ModalBox, ModalContent, ModalHeader, ModalOverlay } from "../Setup/SetupStyles";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
const WishListScreenWrapper = styled.main`
  .wishlist {
    gap: 20px;
  }
`;

const WishItemWrapper = styled.div`
  gap: 30px;
  max-width: 900px;
  position: relative;

  @media (max-width: ${breakpoints.xl}) {
    column-gap: 20px;
  }

  @media (max-width: ${breakpoints.lg}) {
    column-gap: 16px;
  }

  @media (max-width: ${breakpoints.xs}) {
    flex-direction: column;
    gap: 12px;
  }

  .wish-item-img {
    column-gap: 30px;

    @media (max-width: ${breakpoints.xl}) {
      column-gap: 20px;
    }

    @media (max-width: ${breakpoints.lg}) {
      column-gap: 16px;
    }

    &-wrapper {
      min-width: 110px;
      width: 110px;
      border-radius: 4px;
      overflow: hidden;

      @media (max-width: ${breakpoints.xs}) {
        min-width: 100%;
        height: 180px;

        img {
          object-position: top;
        }
      }
    }

    .wish-remove-btn {
      width: 20px;
      min-width: 20px;
      height: 20px;
      border: 1px solid ${defaultTheme.color_outerspace};
      border-radius: 50%;
      font-size: 10px;
      margin-top: auto;
      margin-bottom: auto;

      &:hover {
        background-color: ${defaultTheme.color_gray};
        color: ${defaultTheme.color_white};
        border-color: ${defaultTheme.color_gray};
      }

      @media (max-width: ${breakpoints.sm}) {
        position: absolute;
        right: -10px;
        top: -10px;
      }

      @media (max-width: ${breakpoints.xs}) {
        right: 6px;
        top: 6px;
        background-color: ${defaultTheme.color_jet};
        color: ${defaultTheme.color_white};
      }
    }
  }

  .wish-item-info {
    flex: 1;

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
      row-gap: 8px;
    }

    &-l {
      row-gap: 4px;

      ul {
        row-gap: 4px;
        li {
          span {
            &:last-child {
              margin-left: 4px;
            }
          }
        }
      }
    }

    &-r {
      column-gap: 40px;

      @media (max-width: ${breakpoints.xl}) {
        column-gap: 20px;
      }

      @media (max-width: ${breakpoints.lg}) {
        flex-direction: column;
        align-items: flex-end;
        row-gap: 8px;
      }

      @media (max-width: ${breakpoints.sm}) {
        flex-direction: row;
        align-items: center;
      }

      .wish-item-price {
        @media (max-width: ${breakpoints.sm}) {
          order: 2;
        }
      }

      .wish-cart-btn {
        @media (max-width: ${breakpoints.sm}) {
          order: 1;
        }
      }
    }
  }
`;

const breadcrumbItems = [
  { label: "Home", link: "/" },
  { label: "Build của tôi", link: "/setup-package" },
];

/* ------------------ Modal ------------------ */
interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>{children}</ModalBox>
    </ModalOverlay>,
    document.body
  );
};

const SetupList = () => {
  const setupData = useAppSelector((state) => state.setupPackage.setupPackages);
  const [isModalOpenDelete, setisModalOpenDelete] = useState(false);
  const [selectedSetupId, setSelectedSetupId] = useState<string | null>(null);
  const openModalDelete = (setupPackageId: string) => {
    setSelectedSetupId(setupPackageId);
    setisModalOpenDelete(true);
  };
  const closeModalDelete = () => {
    setisModalOpenDelete(false);
    setSelectedSetupId(null);
  };
  const handleDeleteSetup = async () => {
    if (!selectedSetupId) return;

    try {
      const response = await dispatch(deleteSetup(selectedSetupId)).unwrap();

      if (response) {
        toast.success("Xóa thành công!");
      } else {
        toast.error("Xóa thất bại, vui lòng thử lại.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Xóa thất bại, vui lòng thử lại.");
    } finally {
      closeModalDelete();
    }
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getSetupPackages());
  }, []);
  const navigate = useNavigate();

  return (
    <WishListScreenWrapper className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <div className="flex justify-between items-center">
              <Title titleText="Build của tôi" />
              <BaseBtnGreen onClick={() => navigate(`/setup-package-build`)} className="wish-cart-btn">
                Tạo setup
              </BaseBtnGreen>
            </div>

            <div className="wishlist grid">
              {setupData?.map((setup) => {
                return (
                  <WishItemWrapper className="wish-item flex" key={setup.setupPackageId}>
                    <div className="wish-item-img flex items-stretch">
                      <button
                        type="button"
                        className="wish-remove-btn"
                        onClick={() => openModalDelete(setup.setupPackageId)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                      {/* <div className="wish-item-img-wrapper">
                        <img src={wishlist.imgSource} className="object-fit-cover" alt="" />
                      </div> */}
                    </div>
                    <div className="wish-item-info flex justify-between">
                      <div className="wish-item-info-l flex flex-col">
                        <p className="wish-item-title text-xl font-bold text-outerspace">{setup.setupName}</p>
                        <ul className="flex flex-col">
                          <li>
                            <span className="text-lg font-bold">Ngày tạo:</span>
                            <span className="text-lg text-gray font-medium capitalize">
                              {formatDate(setup.createDate)}
                            </span>
                          </li>
                          <li>
                            <span className="text-lg font-bold">Mô tả:</span>
                            <span className="text-lg text-gray font-medium capitalize">{setup.description}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="wish-item-info-r flex items-center">
                        <span className="wish-item-price text-xl text-gray font-bold">
                          {/* {currencyFormat(setup.totalPrice)} */}
                        </span>
                        <BaseBtnGreen
                          onClick={() => {
                            navigate(`/setup-package/${setup.setupPackageId}`);
                          }}
                          className="wish-cart-btn"
                        >
                          Xem chi tiết
                        </BaseBtnGreen>
                      </div>
                    </div>
                  </WishItemWrapper>
                );
              })}
            </div>

            {/* Modal mở khi bấm "Xóa" */}
            <SimpleModal isOpen={isModalOpenDelete} onClose={closeModalDelete}>
              <ModalHeader></ModalHeader>
              <ModalContent>
                <h2 className="text-xl font-bold text-center">Xóa sản phẩm</h2>
                <p className="text-center text-gray-600 mt-2">Bạn có muốn xóa sản phẩm này?</p>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={closeModalDelete}
                    className="w-1/2 py-2 border border-red-600 text-red-600 font-semibold rounded-lg mr-2"
                  >
                    Không
                  </button>
                  <button
                    onClick={handleDeleteSetup}
                    className="w-1/2 py-2 bg-red-600 text-white font-semibold rounded-lg"
                  >
                    Có
                  </button>
                </div>
              </ModalContent>
            </SimpleModal>
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </WishListScreenWrapper>
  );
};

export default SetupList;
