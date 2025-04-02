import { useEffect, useState } from "react";
import SimpleModal, { ModalContent, ModalHeader } from "./Modal";
import { FaRegCheckCircle, FaTicketAlt, FaTimes } from "react-icons/fa";
import { getAllVouchers, Voucher } from "@redux/slices/voucherSlice";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { currencyFormat, formatDate } from "@ultils/helper";
import LoadingPage from "../Loading/LoadingPage";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVoucher: (voucher: Voucher) => void;
}

export const VoucherModal = ({ isOpen, onClose, onSelectVoucher }: VoucherModalProps) => {
  const dispatch = useAppDispatch();
  const listVouchers = useAppSelector((state) => state.voucher.vouchers);
  const isLoadingVouchers = useAppSelector((state) => state.voucher.isLoading);
  useEffect(() => {
    dispatch(getAllVouchers());
  }, [dispatch]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  if (!isOpen) return null;

  const handleSelectVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    onSelectVoucher(voucher); // Gọi hàm onSelectVoucher để thông báo bên ngoài về voucher đã chọn
  };
  console.log("vouchers", listVouchers);

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center mb-7 mt-2 ">
        <div className="flex items-center gap-2">
          <FaTicketAlt className="text-green text-2xl" />
          <h3 className="text-2xl font-bold">Voucher của bạn</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
          <FaTimes />
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto p-4">
        {isLoadingVouchers ? (
          <LoadingPage />
        ) : (
          <div className="space-y-4">
            {listVouchers?.map((voucher) => (
              <div
                key={voucher.id}
                className="relative flex bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow p-2 "
                onClick={() => handleSelectVoucher(voucher)}
              >
                <div className="w-4 border-r border-dashed border-gray-300"></div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{voucher.voucherCode}</span>
                        <span className="text-sm text-gray-600 italic">Còn ({voucher.quantity})</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{voucher.description}</p>
                      <p className="text-xs text-gray-500 mt-2">HSD: {formatDate(voucher.expiryDate)}</p>
                    </div>
                    <input
                      type="radio"
                      checked={selectedVoucher?.id === voucher.id}
                      onChange={() => {}}
                      className="h-5 w-5 text-green-500 border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SimpleModal>
  );
};
