import { useEffect, useState } from "react";
import SimpleModal, { ModalContent, ModalHeader } from "./Modal";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { BaseBtnGreen } from "@styles/button";
import { FiX } from "react-icons/fi";
import { getAllBank } from "@redux/slices/bankSlice";
import { Order } from "@redux/slices/orderListSlice";
import { refundOrder } from "@redux/slices/orderSlice";
import { toast } from "react-toastify";
import { BookingList } from "@redux/slices/bookingSlice";
import Loading from "../Loading/Loading";
import { getUserProfile } from "@redux/slices/userSlice";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  //Nhận order từ OrderItemList
  booking?: BookingList | null;
}

export const RefundBankModal = ({ isOpen, onClose, order, booking }: RefundModalProps) => {
  const dispatch = useAppDispatch();
  const listBanks = useAppSelector((state) => state.bank.listBank);
  const user = useAppSelector((state) => state.userProfile.user);
  const isLoadingRefund = useAppSelector((state) => state.order.isLoadingRefund);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<{
    BankHolderName: string;
    BankName: string;
    BankNumber: string;
  }>({
    BankHolderName: "",
    BankName: "",
    BankNumber: "",
  });
  useEffect(() => {
    dispatch(getAllBank());
    dispatch(getUserProfile());
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      setData({
        BankHolderName: user.bankHolder || "",
        BankName: user.bankName || "",
        BankNumber: user.bankNumber || "",
      });
      setSearchTerm(user.bankName || "");
    }
  }, [user]);
  const handleRefund = async () => {
    const { BankHolderName, BankName, BankNumber } = data;

    if (!BankHolderName || !BankName || !BankNumber) {
      toast.error("Vui lòng nhập đầy đủ thông tin ngân hàng.");
      return;
    }
    const selectedDAta = order ?? booking;
    const paymentId = selectedDAta?.payment?.paymentId;
    const orderId = order?.id;
    const bookingId = booking?.id;

    if (!paymentId) {
      toast.error("Không tìm thấy mã thanh toán.");
      return;
    }
    try {
      const res = await dispatch(
        refundOrder({
          paymentId,
          bankName: BankName,
          bankNumber: BankNumber,
          bankHolder: BankHolderName,
          orderId,
          bookingId,
        })
      );
      const data = res.payload;
      if (res.meta.requestStatus === "fulfilled" && (data?.status === "200" || data?.status === "201")) {
        toast.success("Yêu cầu hoàn tiền thành công!");
        setData({
          BankHolderName: "",
          BankName: "",
          BankNumber: "",
        });
        onClose(); // đóng modal
      } else {
        const errorMessage = res.payload || "Có lỗi xảy ra khi cập nhật thông tin ngân hàng.";
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
      <div className="p-6 bg-white" role="dialog" aria-modal="true">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Thông tin tài khoản ngân hàng</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngân hàng</label>
            <input
              type="text"
              placeholder="Tìm kiếm ngân hàng..."
              className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
              }}
              value={searchTerm}
            />
            <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto p-2 border rounded-lg">
              {listBanks
                ?.filter((bank) => {
                  const bankName = bank?.name?.toLowerCase?.() || "";
                  const bankCode = bank?.code?.toLowerCase?.() || "";
                  const term = searchTerm?.toLowerCase?.() || "";
                  return bankName.includes(term) || bankCode.includes(term);
                })
                ?.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => {
                      const fullName = `${bank.name} (${bank.shortName})`;
                      setData({ ...data, BankName: fullName });
                      setSearchTerm(bank.name);
                    }}
                    className={`p-2 border rounded-lg cursor-pointer 
                      flex justify-center items-center
                      hover:bg-gray-100
                      ${data.BankName.includes(bank.name) ? "bg-blue-200 border-blue-500" : ""}`}
                  >
                    {bank.logo ? (
                      <img src={bank.logo} alt={bank.shortName} className="h-12 object-contain mx-auto" />
                    ) : (
                      <span className="text-sm font-medium text-gray-700">{bank.shortName || bank.code}</span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
            <input
              type="text"
              name="accountNumber"
              value={data.BankNumber}
              onChange={(e) => setData({ ...data, BankNumber: e.target.value })}
              placeholder="Nhập số tài khoản"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500`}
              maxLength={15}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên tài khoản</label>
            <input
              type="text"
              name="accountName"
              value={data.BankHolderName}
              onChange={(e) => {
                const rawValue = e.target.value;
                const processedValue = rawValue
                  .toUpperCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "");
                setData({ ...data, BankHolderName: processedValue });
              }}
              placeholder="Nhập tên tài khoản"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Hủy
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center`}
              onClick={handleRefund}
            >
              {isLoadingRefund ? <Loading /> : "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
};
