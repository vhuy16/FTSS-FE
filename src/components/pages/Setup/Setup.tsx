import React, { useState, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Container } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getAllCategory } from "@redux/slices/categorySlice";
import { getAllProductSimilar, Product } from "@redux/slices/productSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SetupScreenWrapper = styled.main`
  background-color: #fff;
  border: 1px solid #dee2e6 !important;
  border-radius: 0.3rem !important;
  padding: 40px 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
`;

const LeftSide = styled.div`
  flex: 0 0 800px;
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BuildHeaderCard = styled.div`
  background-color: #fff;
  border: 1px solid #dee2e6 !important;
  border-radius: 0.3rem !important;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #333;
  }

  p {
    font-size: 16px;
    color: #666;
    margin: 0;
  }
`;

const SetupItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #fff;
  border: 1px solid #dee2e6 !important;
  border-radius: 0.3rem !important;
  padding: 1rem;
  margin-bottom: 24px;
`;

const SetupItem = styled.div`
  background-color: #f2f4f6;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column; /* Chia theo chiều dọc */
  gap: 12px;

  .setup-item-content,
  .product-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .setup-item-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .category-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    background-color: #ccc;
  }
  .product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    background-color: #ccc;
  }

  .setup-item-name {
    font-size: 18px;
    font-weight: 700;
    color: #333;
  }

  .setup-item-btn {
    background-color: #10ac97;
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 8px 16px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #0e8c7c;
    }
  }

  .product-info-center {
    flex: 1; /* Giúp căn chỉnh khoảng cách giữa ảnh, tên, giá */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .quantity-control {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .quantity-btn {
    background: #f0f0f0;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }

  .price-info {
    color: red;
    font-weight: bold;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .change-btn {
    color: blue;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 15px;
  }
`;

const TempPriceBox = styled.div`
  background-color: #fff;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 8px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .price {
    font-size: 20px;
    color: #e00;
    margin-bottom: 4px;
  }

  .note {
    font-size: 14px;
    color: #999;

    a {
      color: #007bff;
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        color: #0056b3;
      }
    }
  }
`;

const BannerBox = styled.div`
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 800px;
  max-width: 100%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }

  button {
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
`;

const ModalContent = styled.div`
  font-size: 16px;
`;
const ProductList = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  overflow-y: auto;
  background-color: rgb(226 241 254 / var(--tw-bg-opacity, 1));
`;

const ProductCard = styled.div`
  width: 200px;
  height: 270px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 100%;
    height: 180px;
    object-fit: contain;
    display: block;
  }

  .product-info {
    text-align: center;
    margin-bottom: 8px;

    .product-name {
      font-size: 14px;
      font-weight: 500;
      margin: 0 0 4px 0;
    }

    .new-price {
      font-size: 16px;
      font-weight: 700;
      color: #e00;
    }
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 16px;

    .detail-btn {
      background: none;
      color: #007bff;
      border: none;
      font-size: 12px;
      cursor: pointer;
      text-decoration: underline;
      padding: 4px;
    }

    .select-btn {
      background-color: #e00;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 6px 16px;
      cursor: pointer;
      transition: 0.3s;
      font-weight: bold;
      flex-grow: 1;

      &:hover {
        background-color: #c00;
      }
    }
  }
`;

const FilterWrapper = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  border-bottom: 1px solid #eee;

  .filter-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-btn {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 14px;

    &.active {
      background-color: #10ac97;
      color: #fff;
      border-color: #10ac97;
    }
  }

  .filter-select {
    padding: 6px;
    font-size: 14px;
  }
`;

interface ProductItemProps {
  products: Product;
}
/* ------------------ Setup Component ------------------ */
const Setup: React.FC<ProductItemProps> = () => {
  const dispatch = useAppDispatch();
  const listCategory = useAppSelector((state) => state.category.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedProduct, setSelectedProducts] = useState<{ [key: string]: Product | null }>({});
  const products = useAppSelector((state) => state.product.data?.items);

  console.log("pr", products);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  const openModal = (categoryName: string) => {
    setSelectedCategoryName(categoryName);
    setIsModalOpen(true);

    dispatch(getAllProductSimilar(categoryName));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSelectProduct = (product: Product) => {
    setSelectedProducts((prev) => ({ ...prev, [selectedCategoryName]: product }));
    closeModal();
  };
  return (
    <SetupScreenWrapper>
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
        <BuildHeaderCard>
          <h1>Build Hồ Cá</h1>
          <p>Chọn các linh kiện phù hợp bạn cần để xây dựng hồ cá cho riêng bạn</p>
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
                        src={selectedProduct[cat.categoryName]?.images[0]}
                        alt={selectedProduct[cat.categoryName]?.productName}
                        className="product-image"
                      />
                      <div className="product-info-center">
                        <h3 className="product-name">{selectedProduct[cat.categoryName]?.productName}</h3>
                        <div className="quantity-control">
                          <button className="quantity-btn">-</button>
                          <span className="quantity">22</span>
                          <button className="quantity-btn">+ </button>
                        </div>
                      </div>

                      <div className="price-info">
                        <span className="current-price">{selectedProduct[cat.categoryName]?.price}</span>
                      </div>

                      {/* Đặt nút ở cuối */}
                      <div className="action-buttons">
                        <button className="change-btn" onClick={() => openModal(cat.categoryName)}>
                          Thay đổi
                        </button>
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
                    <span className="new-price">{prod.price.toLocaleString()} đ</span>
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
    </SetupScreenWrapper>
  );
};

export default Setup;
