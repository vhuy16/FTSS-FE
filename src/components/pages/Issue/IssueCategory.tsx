import { useAppDispatch, useAppSelector } from "@redux/hook";
import { getIssueCategorySlice } from "@redux/slices/issueCategorySlice";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllIssue } from "@redux/slices/issueSlice"; // Đảm bảo bạn đã import đúng action getAllIssue

const IssueCategory = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.issueCategory.listIssueCategory);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getIssueCategorySlice()); // Lấy danh sách categories khi component mount
  }, [dispatch]);

  // Lấy issueCategoryId từ searchParams
  const selectedCategoryId = searchParams.get("issueCategoryId");
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "6";

  // Gọi API mỗi khi issueCategoryId thay đổi
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(
        getAllIssue({
          page: parseInt(page),
          size: parseInt(size),
          issueCategoryId: selectedCategoryId, // Gửi selectedCategoryId nếu có
          isAscending: false,
        })
      );
    }
  }, [selectedCategoryId, page, size, dispatch]); // Theo dõi sự thay đổi của issueCategoryId, page, size

  // Hàm xử lý khi chọn category
  const handleCategorySelect = (categoryId: string) => {
    const currentParams = Object.fromEntries(searchParams.entries()); // Lấy các tham số hiện tại
    const updatedParams = {
      ...currentParams, // Giữ nguyên các tham số hiện có
      issueCategoryId: categoryId, // Thêm id của category đã chọn
      page: "1", // Đặt lại trang về 1 khi thay đổi category
    };
    setSearchParams(updatedParams); // Cập nhật lại search params
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Phân loại</h3>
      <div className="space-y-4">
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)} // Gọi hàm khi click vào category
            className={`block text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-300 ${
              category.id === selectedCategoryId ? "font-bold text-blue-600" : ""
            }`}
          >
            {category.issueCategoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IssueCategory;
