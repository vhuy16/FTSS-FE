import styled from "styled-components";
export const ContentWrapper = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
`;
export const BookingServiceStyle = styled.main`
  padding: 40px 0;
  .text-title {
    font-size: 17px;
    font-weight: 600;
  }
  .bookingContainer {
    background-color: #fff;
    border: 1px solid #dee2e6 !important;
    border-radius: 0.3rem !important;
    padding: 60px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .card {
    max-width: 48rem;
    margin: 0 auto;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 1.5rem;
  }

  .flexContainer {
    display: flex;
    gap: 3rem;
    margin-bottom: 2rem;
    align-items: center;
    justify-content: space-between;
  }
  .image {
    width: 10rem;
    height: 10rem;
    border-radius: 0.5rem;
    object-fit: cover;
  }

  .build-info {
    .title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1e3a8a;
    }

    .subtitle {
      color: #4b5563;
      margin-top: 0.25rem;
    }

    .iconText {
      display: flex;
      align-items: center;
      color: #4b5563;
      margin-top: 0.5rem;
    }

    .icon {
      margin-right: 0.25rem;
    }

    .description {
      color: #4b5563;
      margin-top: 1rem;
      line-height: 1.625;
    }
  }

  .customer-info {
    .description {
      color: #4b5563;
      line-height: 1.625;
      padding-bottom: 0.2rem;
    }
    .title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1e3a8a;
      margin-bottom: 1rem;
    }
  }
  .sectionTitle {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  .product {
    .productContainer {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      overflow-x: hidden;
    }

    .productCard {
      flex-shrink: 0;
      width: 16rem;
      background-color: #f0f4f7;
      border-radius: 0.5rem;
      padding: 1.5rem;
    }

    .productImage {
      width: 100%;
      height: 10rem;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .productName {
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .productDescription {
      font-size: 0.875rem;
      color: #4b5563;
    }

    .productPrice {
      color: red;
      font-weight: bold;
      margin-top: 0.5rem;
    }
  }

  .setup {
    margin-left: 2rem;
    padding: 3rem;
    background-color: rgb(241 242 243 / var(--tw-bg-opacity, 1));
    .flexContainer {
      display: flex;
      gap: 3rem;
      margin-bottom: 2rem;
    }
    .build-info {
      .title-setup {
        font-size: 1.3rem;
        font-weight: bold;
      }

      .subtitle {
        color: #4b5563;
        margin-top: 0.25rem;
      }

      .iconText {
        display: flex;
        align-items: center;
        color: #4b5563;
        margin-top: 0.5rem;
      }

      .icon {
        margin-right: 0.25rem;
      }

      .description {
        color: #4b5563;
        margin-top: 1rem;
        line-height: 1.625;
      }
    }
    .productContainer {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      overflow-x: hidden;
    }

    .productCard {
      flex-shrink: 0;
      width: 16rem;
      background-color: #ffff;
      border-radius: 0.5rem;
      padding: 1.5rem;
    }

    .productImage {
      width: 100%;
      height: 10rem;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .productName {
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .productDescription {
      font-size: 0.875rem;
      color: #4b5563;
    }

    .productPrice {
      color: red;
      font-weight: bold;
      margin-top: 0.5rem;
    }
  }

  .service {
    .serviceGrid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding-bottom: 3rem;
      .service-name,
      .service-price {
        font-weight: 600;
        font-size: 15px;
      }
    }
    .serviceButton {
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
    }

    .serviceButton.selected {
      background-color: #10b9b0;
    }

    .serviceButton.unselected {
      background-color: #f3f4f6;
      color: #4b5563;
    }

    .serviceButton.unselected:hover {
      background-color: #a0ede8;
    }
  }

  .bookButton {
    width: 100%;
    padding: 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    color: white;
    transition: background-color 0.2s;
    border: none;
    margin-top: 2rem;
  }

  .bookButton.disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;
export const InfoWrapper = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
  align-items: flex-start;
`;

export const BookingContainer = styled.div`
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.3rem;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const CalendarContainer = styled.div`
  background-color: #fff;
  .sectionTitle {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 12px;
    align-items: center;
    display: flex;
    margin-left: 3rem;
  }
`;
