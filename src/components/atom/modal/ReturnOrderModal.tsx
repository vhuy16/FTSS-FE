import { useEffect, useState } from "react";
import SimpleModal from "./Modal";
import { useAppDispatch, useAppSelector } from "@redux/hook";
import { BaseBtnGreen } from "@styles/button";
import { Order } from "@redux/slices/orderListSlice";
import { returnOrder } from "@redux/slices/orderSlice";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";

interface ReturnOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
}

export const ReturnOrderModal = ({ isOpen, onClose, order }: ReturnOrderModalProps) => {
  const dispatch = useAppDispatch();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const isLoadingReturn = useAppSelector((state) => state.order.isLoadingReturn);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleClose = () => {
    setDescription("");
    setFiles([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (!order?.id) {
      toast.error("Thiếu mã đơn hàng.");
      return;
    }

    if (!description.trim()) {
      toast.error("Vui lòng nhập lý do hoàn trả.");
      return;
    }

    if (files.length === 0) {
      toast.error("Vui lòng chọn ít nhất một hình ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("OrderId", order.id);
    formData.append("Reason", description);
    files.forEach((file) => {
      formData.append("MediaFiles", file);
    });

    try {
      const res = await dispatch(returnOrder(formData)).unwrap();
      if (res.status == 201 || res.status == 200) {
        handleClose();
        toast.success("Gửi yêu cầu hoàn trả thành công!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error as string);
    }
  };

  return (
    <SimpleModal isOpen={isOpen} onClose={handleClose}>
      <div className="p-8 bg-white rounded-lg">
        <h2 className="text-xl font-bold text-center">Nhập thông tin hoàn trả</h2>

        {/* Upload hình vuông */}
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">Ảnh / Video</label>
          <div className="max-h-[500px] overflow-y-auto pr-1">
            <div className="grid grid-cols-3 gap-2">
              {files.map((file, index) => {
                const isVideo = file.type.startsWith("video/");
                const fileURL = previewUrls[index]; // 👈 dùng URL đã memo

                return (
                  <div key={index} className="relative w-full pt-[80%] bg-gray-100 rounded overflow-hidden group">
                    {isVideo ? (
                      <video src={fileURL} controls className="absolute top-0 left-0 w-full h-full object-cover" />
                    ) : (
                      <img
                        src={fileURL}
                        alt={`preview-${index}`}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    )}
                    {/* Nút xoá */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
              <label className="relative w-full pt-[50%] bg-gray-200 hover:bg-gray-300 cursor-pointer rounded flex items-center justify-center text-center text-sm font-medium text-gray-600">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="absolute inset-0 flex items-center justify-center">+ Thêm Ảnh/Video</span>
              </label>
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold">Mô tả lý do</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 pl-2 pr-2 pt-2 pb-12 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Nhập mô tả..."
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleClose}
            className="w-1/2 py-2 border border-gray-600 text-gray-600 font-semibold rounded-lg mr-2"
          >
            Hủy
          </button>
          <BaseBtnGreen onClick={handleSubmit} className="w-1/2 py-2 bg-blue-600 text-white font-semibold rounded-lg">
            {isLoadingReturn ? <Loading></Loading> : "Gửi"}
          </BaseBtnGreen>
        </div>
      </div>
    </SimpleModal>
  );
};
