import { useEffect, useState } from "react";
import SimpleModal, { ModalContent, ModalHeader } from "./Modal";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { BaseBtnGreen } from "@styles/button";
import { FiX } from "react-icons/fi";
import { getAllBank } from "@redux/slices/bankSlice";
import { Order } from "@redux/slices/orderListSlice";
import { refundOrder } from "@redux/slices/orderSlice";
import { toast } from "react-toastify";
import { BookingDetail, Confirm } from "@redux/slices/bookingSlice";
import Loading from "../Loading/Loading";
import { getUserProfile } from "@redux/slices/userSlice";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  booking?: BookingDetail | null;
}

export const ConfirmModal = ({ isOpen, onClose, order, booking }: ConfirmModalProps) => {
  const dispatch = useAppDispatch();
  const isLoadingConfirm = useAppSelector((state) => state.bookingService.isLoadingConfirm);

  const handleConfirm = async () => {
    const orderid = order?.id;
    const bookingid = booking?.id;

    try {
      const res = await dispatch(
        Confirm({
          orderid,
          bookingid,
        })
      );
      const data = res.payload;
      if (res.meta.requestStatus === "fulfilled" && (data?.status === "200" || data?.status === "201")) {
        toast.success("Yêu cầu xác nhận thành công!");
        onClose(); // đóng modal
      } else {
        const errorMessage = res.payload || "Có lỗi xảy ra khi cập nhật.";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Refund failed", err);
    }
  };
  const handleClose = () => {
    onClose();
  };
  return (
    <SimpleModal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader></ModalHeader>
      <ModalContent>
        <h2 className="text-xl font-bold text-center">Xác nhận đơn hàng</h2>
        <p className="text-center text-gray-600 mt-2">Bạn có chắc chắn muốn xác nhận không?</p>
        <div className="flex justify-between mt-6">
          <button
            onClick={handleClose}
            className="w-1/2 py-2 border border-gray-600 text-gray-600 font-semibold rounded-lg mr-2"
          >
            Không
          </button>
          <button
            onClick={handleConfirm}
            className="w-1/2 py-2 bg-green-600 text-white font-semibold rounded-lg flex justify-center items-center"
          >
            {isLoadingConfirm ? <Loading /> : "Xác nhận "}
          </button>
        </div>
      </ModalContent>
    </SimpleModal>
  );
};
