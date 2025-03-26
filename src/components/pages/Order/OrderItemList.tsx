import PropTypes from "prop-types";
import OrderItem from "./OrderItem";
import { getAllOrdersByUsers, Order } from "@redux/slices/orderListSlice";
import { breakpoints, defaultTheme } from "@styles/themes/default";
import styled from "styled-components";
import { BaseBtnGreen, BaseLinkOutlineGreen, BaseLinkRed } from "@styles/button";
import { useNavigate } from "react-router-dom";
import { currencyFormat, formatDate } from "@ultils/helper";
import { HorizontalLine, HorizontalLineTAb } from "@styles/styles";
import SimpleModal, { ModalContent, ModalHeader } from "@components/atom/modal/Modal";
import Loading from "@components/atom/Loading/Loading";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { updateOrder } from "@redux/slices/orderSlice";
import { toast } from "react-toastify";

interface OrderItemListProps {
  orders: Order[]; // Changed to an array of Order
}
const OrderItemListWrapper = styled.div`
  margin: 30px 0;
  .order-items {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 18px;
  }
  .order-item-title {
    margin-bottom: 12px;
  }

  .order-item-details {
    padding: 24px 32px;
    border-radius: 8px;

    @media (max-width: ${breakpoints.sm}) {
      padding: 20px 24px;
    }

    @media (max-width: ${breakpoints.xs}) {
      padding: 12px 16px;
    }
  }

  .order-info-group {
    margin-top: 30px;
    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
    }
  }

  .order-info-item {
    width: 50%;

    span {
      &:nth-child(2) {
        margin-left: 4px;
      }
    }

    &:nth-child(even) {
      text-align: right;
      @media (max-width: ${breakpoints.lg}) {
        text-align: left;
      }
    }

    @media (max-width: ${breakpoints.sm}) {
      width: 100%;
      margin: 2px 0;
    }
  }

  .order-overview {
    margin: 28px 0;
    gap: 12px;

    @media (max-width: ${breakpoints.lg}) {
      margin: 20px 0;
    }

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
    }

    &-img {
      width: 100px;
      height: 100px;
      border-radius: 6px;
      overflow: hidden;
    }

    &-content {
      grid-template-columns: 100px auto;
      gap: 18px;
    }

    &-info {
      ul {
        span {
          &:nth-child(2) {
            margin-left: 4px;
          }
        }
      }
    }
  }
  .order-items-last {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }

  .total-price {
    text-align: right;
    flex-shrink: 0;
    font-size: 18px;
    font-weight: bold;
    margin-top: 18px;
  }

  .total-price-text {
    color: #ee4d2d;
    font-size: 25px;
    margin-left: 10px;
  }

  .order-btn {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  .order-btn button {
    padding: 10px 30px;
    font-size: 18px;
    border-radius: 4px;
  }
  .btn-primary {
    background-color: #ee4d2d;
    color: white;
    border: none;
  }
  .btn-secondary {
    background-color: white;
    border: 1px solid #ccc;
  }
  .btn-third {
    background-color: #d0011b;
    color: white;
    border: none;
  }
  .btn-dropdown {
    background-color: white;
    border: 1px solid #ccc;
  }
`;

const OrderItemList: React.FC<OrderItemListProps> = ({ orders }) => {
  const navigate = useNavigate();
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const isLoadingUpdate = useAppSelector((state) => state.order.isLoadingUpdate);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const openModalDelete = () => {
    setIsModalOpenDelete(true);
  };
  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      await dispatch(updateOrder({ id: selectedOrderId, status: "CANCELLED" }));
      toast.success("Đơn hàng đã được hủy!");
      dispatch(getAllOrdersByUsers());
      setIsModalOpenDelete(false);
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại!");
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };
  console.log("or", orders);
  return (
    <OrderItemListWrapper>
      {orders?.map((order) => (
        <div className="order-items" key={order.id}>
          {/* Hiển thị thông tin đơn hàng */}
          <div className="order-item-details">
            <div className="flex justify-between items-center pb-5">
              <h3 className="text-gray-800 order-item-title font-bold">Mã đặt hàng: {order.id}</h3>
              <BaseBtnGreen onClick={() => navigate(`/order-detail/${order.id}`)}>Xem chi tiết</BaseBtnGreen>
            </div>
            <HorizontalLineTAb></HorizontalLineTAb>
          </div>
          {/* Hiển thị danh sách sản phẩm của đơn hàng */}
          {order.orderDetails?.map((item, index) => (
            <OrderItem key={`${order.id}-${index}`} order={order} item={item} />
          ))}
          <HorizontalLineTAb></HorizontalLineTAb>
          <div className="order-items-last">
            {/* Tổng tiền */}
            <div className="total-price">
              Thành tiền: <span className="total-price-text">{currencyFormat(order.totalPrice)}</span>
            </div>
            {/* Các nút thao tác */}
            <div className="order-btn">
              {order.status === "CANCELLED" && (
                <>
                  <button className="btn-primary">Mua lại</button>
                  <button className="btn-secondary">Liên hệ shop</button>
                </>
              )}
              {order.status === "PROCESSING" && (
                <>
                  <button
                    className="btn-third"
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      openModalDelete();
                    }}
                  >
                    Hủy đơn
                  </button>
                  <button className="btn-secondary">Yêu Cầu Trả Hàng/Hoàn Tiền</button>
                </>
              )}
              {order.status === "COMPLETED" && (
                <>
                  {order.setupPackage ? (
                    <button className="btn-primary" onClick={() => navigate(`/setup-booking/${order.id}`)}>
                      Đặt Lịch
                    </button>
                  ) : (
                    <button className="btn-primary">Đánh Giá</button>
                  )}
                  <button className="btn-secondary">Liên hệ người bán</button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      <SimpleModal isOpen={isModalOpenDelete} onClose={closeModalDelete}>
        <ModalHeader></ModalHeader>
        <ModalContent>
          <h2 className="text-xl font-bold text-center">Hủy đơn hàng</h2>
          <p className="text-center text-gray-600 mt-2">Bạn có chắc chắn muốn hủy đơn hàng không?</p>
          <div className="flex justify-between mt-6">
            <button
              onClick={closeModalDelete}
              className="w-1/2 py-2 border border-red-600 text-red-600 font-semibold rounded-lg mr-2"
            >
              Không
            </button>
            <button
              onClick={handleCancelOrder}
              className="w-1/2 py-2 bg-red-600 text-white font-semibold rounded-lg flex justify-center items-center"
            >
              {isLoadingUpdate ? <Loading /> : "Xác nhận "}
            </button>
          </div>
        </ModalContent>
      </SimpleModal>
    </OrderItemListWrapper>
  );
};

export default OrderItemList;

OrderItemList.propTypes = {
  orders: PropTypes.array.isRequired, // Ensure orders is required and an array
};
