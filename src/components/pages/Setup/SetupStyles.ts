import styled from "styled-components";
export const SetupScreenWrapper = styled.main`
  background-color: #fff;
  border: 1px solid #dee2e6 !important;
  border-radius: 0.3rem !important;
  padding: 40px 0;
`;

export const ContentWrapper = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
`;

export const LeftSide = styled.div`
  flex: 0 0 850px;
`;

export const RightSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const BuildHeaderCard = styled.div`
  background-color: #fff;
  border: 1px solid #dee2e6 !important;
  border-radius: 0.3rem !important;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;

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

export const SetupItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #fff;
  border: 1px solid #dee2e6 !important;
  border-radius: 0.3rem !important;
  padding: 1rem;
  margin-bottom: 24px;
`;

export const SetupItem = styled.div`
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
    gap: 15px;
    .product-name {
      margin-left: 2rem;
      font-size: 20px;
      font-weight: 700;
      color: rgb(90 98 113 / var(--tw-text-opacity, 1));
    }
    .product-info-center-btn {
      display: flex;
      align-items: center;
      gap: 17px;
      .delete-btn {
        text-decoration-line: underline;
        color: #093fda;
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
  .product-info-last {
    flex: 1; /* Giúp căn chỉnh khoảng cách giữa ảnh, tên, giá */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 45px;
    .current-price {
      font-size: 20px;
      color: red;
      font-weight: bold;
    }
    .change-btn {
      color: #093fda;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 20px;
      font-weight: 600;
    }
  }
`;
export const QuantityWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 9px;
  padding: 5px 5px;
  border: 1px solid #dee2e6 !important ;
  margin-left: 2rem;

  button {
    background: transparent;
    border: none;
    font-size: 22px; /* Tăng cỡ chữ để dấu +, - to hơn */
    font-weight: 700;
    width: 20px; /* Tạo chút chiều rộng để dễ bấm */
    height: 20px; /* Tạo chút chiều cao để dễ bấm */
    cursor: pointer;
    outline: none;
    line-height: 1; /* Đảm bảo text không bị đẩy lên hoặc xuống */
    text-align: center; /* Căn giữa dấu +, - trong button */
    color: #093fda;
  }

  span {
    margin: 0 8px;
    font-size: 18px; /* Cỡ chữ cho số */
    font-weight: 500;
    min-width: 20px;
    text-align: center;
    line-height: 1;
    color: #093fda;
  }
`;
export const TempPriceBox = styled.div`
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

export const BannerBox = styled.div`
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

export const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Build hồ cá", link: "/setup-package" },
];

export const ModalOverlay = styled.div`
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

export const ModalBox = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 750px;
  max-width: 100%;
`;

export const ModalHeader = styled.div`
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

export const ModalContent = styled.div`
  font-size: 16px;
`;
export const ProductList = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  overflow-y: auto;
  background-color: rgb(226 241 254 / var(--tw-bg-opacity, 1));
`;

export const ProductCard = styled.div`
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
    .product-info-center {
      .product-name {
        font-size: 20px;
        font-weight: 500;
        margin: 0 0 4px 0;
      }
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

export const FilterWrapper = styled.div`
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
