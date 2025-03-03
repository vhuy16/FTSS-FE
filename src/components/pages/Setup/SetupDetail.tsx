import React, { useState, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Container } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllCategory } from "@redux/slices/categorySlice";
import { getAllProductSimilar, Product } from "@redux/slices/productSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { currencyFormat } from "@ultils/helper";
import { getSetupDetail } from "@redux/slices/setupDetailSlice";
import {
  BannerBox,
  BuildHeaderCard,
  ContentWrapper,
  FilterWrapper,
  LeftSide,
  ModalBox,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ProductCard,
  ProductList,
  QuantityWrapper,
  RightSide,
  SetupItem,
  SetupItemsList,
  SetupScreenWrapper,
  TempPriceBox,
} from "./SetupStyles";
import { BaseBtnGreen } from "@styles/button";
import { object } from "prop-types";
import { updateSetupPackage } from "@redux/slices/setupSlice";
import { log } from "console";
// import { Product } from "@redux/slices/setupSlice";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Build hồ cá", link: "/setup-package" },
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
interface ProductItemProps {
  products: Product;
}
/* ------------------ Setup Component ------------------ */
const SetupDetail: React.FC<ProductItemProps> = () => {
  const dispatch = useAppDispatch();
  const listCategory = useAppSelector((state) => state.category.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setisModalOpenDelete] = useState(false);
  const [isModalOpenSave, setisModalOpenSave] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedProduct, setSelectedProducts] = useState<{ [key: string]: Product | null }>({});
  const products = useAppSelector((state) => state.product.data?.items);
  const { setupPackageId } = useParams();
  const setupData = useAppSelector((state) => state.setupPackageDetail.data);
  const [setupName, setSetupName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getSetupDetail(setupPackageId as string));
  }, [setupPackageId]);

  useEffect(() => {
    if (setupData?.products) {
      const initialSelectedProducts = setupData.products.reduce((acc: { [key: string]: Product }, item: any) => {
        acc[item.categoryName] = item;
        return acc;
      }, {});

      setSelectedProducts(initialSelectedProducts);
    }
  }, [setupData]);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  const openModal = (categoryName: string) => {
    setSelectedCategoryName(categoryName);
    setIsModalOpen(true);

    dispatch(getAllProductSimilar(categoryName));
  };
  const openModalDelete = (categoryName: string) => {
    setSelectedCategoryName(categoryName);
    setisModalOpenDelete(true);
  };
  const openModalSave = () => {
    setisModalOpenSave(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeModalSave = () => {
    setisModalOpenSave(false);
  };
  const closeModalDelete = () => {
    setisModalOpenDelete(false);
  };
  const handleSelectProduct = (product: Product) => {
    setSelectedProducts((prev) => ({ ...prev, [selectedCategoryName]: product }));
    closeModal();
  };
  const handleDeleteProduct = () => {
    setSelectedProducts((prev) => {
      const updatedProducts = { ...prev };
      delete updatedProducts[selectedCategoryName];
      return updatedProducts;
    });

    closeModalDelete();
  };
  const [quantity, setQuantity] = useState<number>(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  console.log("selectdetail", selectedProduct);
  const sendDataProduct = Object.values(selectedProduct).map((item) => item?.id || null);
  console.log("Dữ liệu gửi đi:", sendDataProduct);
  console.log("Aa", setupData);

  useEffect(() => {
    if (isModalOpenSave && setupData) {
      setSetupName(setupData.setupName);
      setDescription(setupData.description);
    }
  }, [isModalOpenSave, setupData]);
  const handleSave = async () => {
    try {
      // Kiểm tra thông tin trước khi gửi
      if (!setupPackageId || !setupName.trim() || !description.trim() || sendDataProduct.length === 0) {
        toast.error("Vui lòng nhập đầy đủ thông tin.");
        return;
      }

      const formData = new FormData();
      formData.append("SetupName", setupName.trim());
      formData.append("Description", description.trim());

      sendDataProduct.forEach((id) => {
        if (id) {
          formData.append("productIds", id);
        }
      });

      // Kiểm tra hình ảnh trước khi thêm vào formData
      formData.append("ImageFile", imageFile || "");

      // Gọi API cập nhật
      const response = await dispatch(updateSetupPackage({ setupPackageId, formData }));

      if (response?.payload?.status === "200" || response?.payload?.status === "201") {
        toast.success("Cập nhật thành công!");
        dispatch(getSetupDetail(setupPackageId as string));
        closeModalSave();
      } else {
        toast.error(response?.payload);
      }
    } catch (error) {
      console.error("Lỗi khi lưu setup package:", error);
      toast.error("Lưu thất bại, vui lòng thử lại.");
    }
  };

  const navigate = useNavigate();
  return (
    <SetupScreenWrapper>
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
        <BuildHeaderCard>
          <div className="header-text">
            <h1>{setupData?.setupName}</h1>
            <p>Mô tả : {setupData?.description}</p>
          </div>
          <BaseBtnGreen
            onClick={() => {
              openModalSave();
            }}
            className="save-btn"
          >
            Lưu thay đổi
          </BaseBtnGreen>
        </BuildHeaderCard>
        <ContentWrapper>
          {/* Cột trái: Danh sách hạng mục */}
          <LeftSide>
            <SetupItemsList>
              {listCategory?.map((cat: any) => (
                <SetupItem key={cat.id}>
                  {selectedProduct[cat.categoryName] ? (
                    // Khi sản phẩm đã được chọn
                    <div className="product-info">
                      <img
                        src={
                          Array.isArray(selectedProduct[cat.categoryName]?.images)
                            ? (selectedProduct[cat.categoryName]?.images[0] as string) // Ép kiểu về string
                            : (selectedProduct[cat.categoryName]?.images as string) ?? ""
                        }
                        alt={selectedProduct[cat.categoryName]?.productName}
                        className="product-image"
                      />
                      <div className="product-info-center">
                        <h2 className="product-name">{selectedProduct[cat.categoryName]?.productName}</h2>
                        {/* Nút tăng giảm số lượng */}
                        <div className="product-info-center-btn">
                          <QuantityWrapper>
                            <button onClick={handleDecrement}>-</button>
                            <span>{quantity}</span>
                            <button onClick={handleIncrement}>+</button>
                          </QuantityWrapper>
                          <button className="delete-btn" onClick={() => openModalDelete(cat.categoryName)}>
                            Xóa
                          </button>
                        </div>
                      </div>
                      <div className="product-info-last">
                        <h2 className="current-price">
                          {currencyFormat(selectedProduct[cat.categoryName]?.price ?? 0)}
                        </h2>

                        {/* Đặt nút ở cuối */}
                        <div className="action-buttons">
                          <button className="change-btn" onClick={() => openModal(cat.categoryName)}>
                            Thay đổi
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Khi chưa chọn sản phẩm
                    <div className="setup-item-content">
                      <div className="setup-item-left">
                        <img src={cat.linkImage} alt={cat.categoryName} className="category-image" />
                        <span className="setup-item-name">{cat.categoryName}</span>
                      </div>

                      {/* Đặt nút ở cuối */}
                      <div className="action-buttons">
                        <button className="setup-item-btn" onClick={() => openModal(cat.categoryName)}>
                          Chọn
                        </button>
                      </div>
                    </div>
                  )}
                </SetupItem>
              ))}
            </SetupItemsList>
          </LeftSide>

          {/* Cột phải: Tạm tính + Banner */}
          <RightSide>
            <TempPriceBox>
              <h3>Tạm tính:</h3>
              <p className="price">0 VNĐ</p>
              <p className="note">
                Giá chưa bao gồm khuyến mãi Build Hồ Cá. <a href="#xemchi">Xem chi tiết</a>
              </p>
            </TempPriceBox>
            <BannerBox>
              <img src="/images/aquarium-banner.jpg" alt="Banner hồ cá" />
            </BannerBox>
          </RightSide>
        </ContentWrapper>
      </Container>
      {/* Modal mở khi bấm "Chọn" */}
      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>
          <h2>{selectedCategoryName}</h2>
          <button onClick={closeModal}>&times;</button>
        </ModalHeader>
        <ModalContent>
          <FilterWrapper>
            <div className="filter-group">
              <span>Chọn thương hiệu:</span>
              <button className="filter-btn active">Tất cả</button>
              <button className="filter-btn">AquaPro</button>
              <button className="filter-btn">Whale</button>
            </div>
            <div className="filter-group">
              <span>Sắp xếp:</span>
              <select className="filter-select">
                <option>Mặc định</option>
                <option>Giá tăng dần</option>
                <option>Giá giảm dần</option>
              </select>
            </div>
          </FilterWrapper>

          {products && products.length > 0 ? (
            <ProductList>
              {products.map((prod: any) => (
                <ProductCard key={prod.id}>
                  <img src={prod.images} alt={prod.name} />
                  <div className="product-info">
                    <h3 className="product-name">{prod.name}</h3>
                    <span className="new-price">{currencyFormat(prod.price)}</span>
                  </div>
                  <div className="buttons">
                    <button
                      className="detail-btn"
                      onClick={() => {
                        if (prod.status === "Available") {
                          navigate(`/product/${prod.id}`);
                        } else {
                          toast.error("Sản Phẩm Đã Dừng Hoạt Động");
                        }
                      }}
                    >
                      Xem chi tiết
                    </button>
                    <button className="select-btn" onClick={() => handleSelectProduct(prod)}>
                      Chọn
                    </button>
                  </div>
                </ProductCard>
              ))}
            </ProductList>
          ) : (
            <p>Không có sản phẩm nào.</p>
          )}
        </ModalContent>
      </SimpleModal>

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
            <button onClick={handleDeleteProduct} className="w-1/2 py-2 bg-red-600 text-white font-semibold rounded-lg">
              Có
            </button>
          </div>
        </ModalContent>
      </SimpleModal>

      <SimpleModal isOpen={isModalOpenSave} onClose={closeModalSave}>
        <div className="p-8 bg-white rounded-lg">
          <h2 className="text-xl font-bold text-center">Cập Nhật thông tin</h2>

          <div className="mt-4">
            <label className="block text-gray-700 font-semibold">Tên</label>
            <input
              type="text"
              value={setupName}
              onChange={(e) => setSetupName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Nhập tên..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-semibold">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Nhập mô tả..."
              rows={3}
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={closeModalSave}
              className="w-1/2 py-2 border border-gray-600 text-gray-600 font-semibold rounded-lg mr-2"
            >
              Hủy
            </button>
            <button onClick={handleSave} className="w-1/2 py-2 bg-blue-600 text-white font-semibold rounded-lg">
              Lưu
            </button>
          </div>
        </div>
      </SimpleModal>
    </SetupScreenWrapper>
  );
};

export default SetupDetail;
