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
  ProductCard,
  ProductList,
  QuantityWrapper,
  RightSide,
  SetupItem,
  SetupItemsList,
  SetupScreenWrapper,
  TempPriceBox,
} from "./SetupStyles";
import { BaseBtnGreen, BaseButtonGreen } from "@styles/button";
import { updateSetupPackage } from "@redux/slices/setupSlice";
import { addSetup, deleteSelectSetupId, removeCart, selectSetup, selectSetupId } from "@redux/slices/cartSlice";
import Loading from "@components/atom/Loading/Loading";
import SimpleModal, { ModalContent, ModalHeader } from "@components/atom/modal/Modal";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Build hồ cá", link: "/setup-package" },
];

interface ProductItemProps {
  products: Product;
}

/* ------------------ Setup Component ------------------ */
const SetupDetail: React.FC<ProductItemProps> = () => {
  const dispatch = useAppDispatch();
  const listCategory = useAppSelector((state) => state.category.categories);
  const isLoadingAdd = useAppSelector((state) => state.cart.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenSave, setIsModalOpenSave] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<(Product & { quantity: number })[]>([]);
  const products = useAppSelector((state) => state.product.data?.items);
  const { setupPackageId } = useParams();
  const setupData = useAppSelector((state) => state.setupPackageDetail.data);
  const [setupName, setSetupName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToChange, setProductToChange] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingSetup = useAppSelector((state) => state.setupPackage.loading);
  const [subCategories, setSubCategories] = useState<string[]>(["Tất cả"]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Tất cả");

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(removeCart());
    dispatch(deleteSelectSetupId());
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getSetupDetail(setupPackageId as string));
    console.log(setupData);
  }, [setupPackageId]);

  useEffect(() => {
    if (setupData?.products) {
      const initialSelectedProducts = setupData.products.map((product: any) => ({
        ...product,
        quantity: product.quantity || 1, // cho quantity có giá trị mặc định la 1
      }));
      setSelectedProducts(initialSelectedProducts);
    }
  }, [setupData]);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);
  useEffect(() => {
    if (isModalOpenSave && setupData) {
      setSetupName(setupData.setupName);
      setDescription(setupData.description);
    }
  }, [isModalOpenSave, setupData]);
  // Mở modal và lấy subCategories
  const openModal = async (categoryName: string, product?: Product) => {
    setSelectedCategoryName(categoryName);
    setIsModalOpen(true);
    if (product) {
      setProductToChange(product);
    }
    setIsLoading(true);
    try {
      await dispatch(getAllProductSimilar(categoryName));
      const currentCategory = listCategory.find((cat) => cat.categoryName === categoryName);
      const newSubCategories =
        currentCategory && currentCategory.subCategories
          ? ["Tất cả", ...currentCategory.subCategories.map((sub) => sub.subCategoryName)]
          : ["Tất cả"];
      setSubCategories(newSubCategories); // Cập nhật state subCategories
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModalDelete = (product: Product) => {
    setProductToDelete(product);
    setIsModalOpenDelete(true);
  };

  const openModalSave = () => {
    setIsModalOpenSave(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToChange(null); // Reset sản phẩm đang thay đổi khi đóng modal
  };

  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
    setProductToDelete(null);
  };

  const closeModalSave = () => {
    setIsModalOpenSave(false);
  };

  const handleSelectProduct = (product: Product) => {
    if (productToChange) {
      // Nếu đang trong chế độ thay đổi sản phẩm
      setSelectedProducts((prev) =>
        prev.map((p) => (p.id === productToChange.id ? { ...product, quantity: p.quantity } : p))
      );
      setProductToChange(null); // Reset sản phẩm đang thay đổi
    } else {
      // Nếu không phải chế độ thay đổi, xử lý như binh thuong
      setSelectedProducts((prev) => {
        const existingProductIndex = prev.findIndex((p) => p.id === product.id);

        if (existingProductIndex !== -1) {
          // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
          const updatedProducts = [...prev];
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            quantity: updatedProducts[existingProductIndex].quantity + 1,
          };
          return updatedProducts;
        } else {
          // Nếu sản phẩm chưa co, thêm mới với quantity = 1
          return [...prev, { ...product, quantity: 1 }];
        }
      });
    }
    closeModal(); // Đóng modal sau khi chọn sản phẩm
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      closeModalDelete();
    }
  };

  const handleSave = async () => {
    try {
      if (!setupPackageId || !setupName.trim() || !description.trim() || selectedProducts.length === 0) {
        toast.error("Vui lòng nhập đầy đủ thông tin.");
        return;
      }

      // Tạo mảng JSON chứa thông tin sản phẩm
      const productsData = selectedProducts.map((product) => ({
        ProductId: product.id,
        Quantity: product.quantity,
      }));

      // Chuyển mảng JSON thành chuỗi
      const productsJson = JSON.stringify(productsData);

      // Tạo FormData và thêm các trường dữ liệu
      const formData = new FormData();
      formData.append("SetupName", setupName.trim());
      formData.append("Description", description.trim());
      formData.append("ProductItemsJson", productsJson); // Thêm chuỗi JSON vào FormData
      formData.append("ImageFile", imageFile || "");

      const response = await dispatch(updateSetupPackage({ setupPackageId, formData }));

      if (response?.payload?.status === "200" || response?.payload?.status === "201") {
        toast.success("Cập nhật thành công!");
        dispatch(getSetupDetail(setupPackageId as string));
        closeModalSave();
      } else {
        toast.error(response?.payload);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật setup package:", error);
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, quantity: newQuantity } : product))
    );
  };

  const totalPrice = selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);

  // lọc theo subcate

  useEffect(() => {
    const currentCategory = listCategory.find((cat) => cat.categoryName === selectedCategoryName);
    const newSubCategories =
      currentCategory && currentCategory.subCategories
        ? ["Tất cả", ...currentCategory.subCategories.map((sub) => sub.subCategoryName)]
        : ["Tất cả"];
    setSubCategories(newSubCategories); // Cập nhật state subCategories
  }, [listCategory, selectedCategoryName]); // Chỉ chạy lại khi listCategory hoặc selectedCategoryName thay đổi

  // Lọc sản phẩm theo subcategory
  const filterProductsBySubcategory = (products: Product[] | null | undefined, subcategory: string) => {
    if (!products) return [];
    if (subcategory === "Tất cả") {
      return products;
    }
    return products.filter((product) => product.subCategoryName === subcategory);
  };

  return (
    <SetupScreenWrapper>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <BuildHeaderCard>
          <div className="header-text">
            <h1>{setupData?.setupName}</h1>
            <p>Mô tả: {setupData?.description}</p>
          </div>
          <BaseBtnGreen onClick={openModalSave} className="save-btn">
            Chỉnh sửa
          </BaseBtnGreen>
        </BuildHeaderCard>
        <ContentWrapper>
          <LeftSide>
            <SetupItemsList>
              {listCategory?.map((cat: any) => (
                <SetupItem key={cat.id}>
                  {selectedProducts.some((p) => p.categoryName === cat.categoryName) ? (
                    <div>
                      {/* Thêm điều kiện ẩn nút "Chọn thêm" khi là loại bể */}
                      {cat.categoryName !== "Bể" && (
                        <div className="change-btn">
                          <BaseBtnGreen onClick={() => openModal(cat.categoryName)}>Chọn thêm</BaseBtnGreen>
                        </div>
                      )}
                      {selectedProducts
                        .filter((product) => product.categoryName === cat.categoryName)
                        .map((product) => (
                          <div className="product-info" key={product.id}>
                            <img
                              src={Array.isArray(product.images) ? product.images[0] : product.images ?? ""}
                              alt={product.productName}
                              className="product-image"
                            />
                            <div className="product-info-center">
                              <h2 className="product-name">{product.productName}</h2>
                              <div className="product-info-center-btn">
                                <QuantityWrapper>
                                  <button
                                    onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                                    disabled={product.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span>{product.quantity}</span>
                                  <button onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>
                                    +
                                  </button>
                                </QuantityWrapper>
                                <button className="delete-btn" onClick={() => openModalDelete(product)}>
                                  Xóa
                                </button>
                              </div>
                            </div>
                            <div className="product-info-last">
                              <h2 className="current-price">{currencyFormat(product.price * product.quantity)}</h2>
                              <div className="action-buttons">
                                <button className="change-btn" onClick={() => openModal(cat.categoryName, product)}>
                                  Thay đổi
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="setup-item-content">
                      <div className="setup-item-left">
                        <img src={cat.linkImage} alt={cat.categoryName} className="category-image" />
                        <span className="setup-item-name">{cat.categoryName}</span>
                      </div>
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
          <RightSide>
            <TempPriceBox>
              <h3>Tạm tính:</h3>
              <p className="price">{currencyFormat(totalPrice)}</p>
              <p className="note">
                Giá chưa bao gồm khuyến mãi Build Hồ Cá. <a href="#xemchi">Xem chi tiết</a>
              </p>
            </TempPriceBox>
            <BaseButtonGreen
              type="submit"
              className="checkout-btn"
              onClick={async () => {
                const token = localStorage.getItem("access_token");
                if (totalPrice === 0) {
                  toast.warning("Vui lòng chọn sản phẩm để thanh toán");
                } else {
                  if (token) {
                    const res = await dispatch(addSetup(setupPackageId)).unwrap();
                    dispatch(selectSetup(res.cartItems));
                    dispatch(selectSetupId(res.setupId));
                    navigate("/checkout");
                  } else {
                    toast.warning("Xin mời đăng nhập trước để thanh toán");
                    navigate("/login");
                  }
                }
              }}
            >
              {isLoadingAdd ? <Loading></Loading> : "Tiến hành thanh toán"}
            </BaseButtonGreen>
          </RightSide>
        </ContentWrapper>
      </Container>
      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>
          <h2>{selectedCategoryName}</h2>
          <button onClick={closeModal}>&times;</button>
        </ModalHeader>
        <ModalContent>
          <FilterWrapper>
            <div className="filter-group">
              <span>Chọn theo loại:</span>
              {subCategories.map(
                (
                  subcat // Sử dụng state subCategories
                ) => (
                  <button
                    key={subcat}
                    className={`filter-btn ${selectedSubcategory === subcat ? "active" : ""}`}
                    onClick={() => setSelectedSubcategory(subcat)}
                  >
                    {subcat}
                  </button>
                )
              )}
            </div>
          </FilterWrapper>
          {isLoading ? (
            <Loading />
          ) : filterProductsBySubcategory(products, selectedSubcategory).length > 0 ? (
            <ProductList>
              {filterProductsBySubcategory(products, selectedSubcategory).map((prod: Product) => (
                <ProductCard key={prod.id}>
                  <img src={prod.images[0]} alt={prod.productName} />
                  <div className="product-info">
                    <h3 className="product-name">{prod.productName}</h3>
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
              onClick={handleDeleteProduct}
              className="w-1/2 py-2 bg-red-600 text-white font-semibold rounded-lg flex justify-center items-center"
            >
              {isLoadingSetup ? <Loading /> : <>Có</>}
            </button>
          </div>
        </ModalContent>
      </SimpleModal>
      <SimpleModal isOpen={isModalOpenSave} onClose={closeModalSave}>
        <div className="p-8 bg-white rounded-lg">
          <h2 className="text-xl font-bold text-center">Chỉnh sửa thông tin bể cá</h2>
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
            <button
              className="w-1/2 py-2 bg-green-150 text-white font-semibold rounded-lg flex justify-center items-center"
              onClick={handleSave}
            >
              {" "}
              {isLoadingSetup ? <Loading /> : <>Lưu</>}
            </button>
          </div>
        </div>
      </SimpleModal>
    </SetupScreenWrapper>
  );
};

export default SetupDetail;
