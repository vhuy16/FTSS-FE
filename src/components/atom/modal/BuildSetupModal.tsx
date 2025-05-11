import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";
import { FiX } from "react-icons/fi";
import { breakpoints } from "@styles/themes/default";
import styled from "styled-components";
import { BookingContainer } from "@components/pages/Booking/BookingServiceStyle";
import { useNavigate } from "react-router-dom";
import { FilterWrapper, ProductCard, ProductList } from "@components/pages/Setup/SetupStyles";
import { currencyFormat } from "@ultils/helper";
import { Product } from "@redux/slices/productSlice";
import { RecommendationItem, Recommendations } from "@redux/slices/recommendSlice";
import { useMemo } from "react";

interface BuildSetupModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedCategoryName: string;
  subCategories: string[];
  selectedSubcategory: string;
  setSelectedSubcategory: (subcat: string) => void;
  products: Product[];
  filterProductsBySubcategory: (products: Product[], subcategory: string) => Product[];
  isLoading: boolean;
  handleSelectProduct: (product: Product) => void;
  recommendations: Recommendations | null | undefined;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
};

const BillingOrderWrapper = styled.div`
  gap: 60px;

  @media (max-width: ${breakpoints.xl}) {
    gap: 40px;
  }
  @media (max-width: ${breakpoints.lg}) {
    gap: 30px;
    grid-template-columns: 100%;
  }
`;

export default function BuildSetupModal({
  isModalOpen,
  closeModal,
  selectedCategoryName,
  subCategories,
  selectedSubcategory,
  setSelectedSubcategory,
  products,
  filterProductsBySubcategory,
  isLoading,
  handleSelectProduct,
  recommendations,
}: BuildSetupModalProps) {
  const navigate = useNavigate();

  // Hàm sắp xếp sản phẩm, ưu tiên sản phẩm có trong recommendations
  const sortProducts = (products: Product[]): Product[] => {
    return [...products].sort((a, b) => {
      // Kiểm tra xem sản phẩm có trong recommendations không
      const isARecommended = recommendations
        ? [
            ...(recommendations.filters || []),
            ...(recommendations.lights || []),
            ...(recommendations.substrates || []),
            ...(recommendations.otherProducts || []),
          ].some((rec) => rec.id === a.id)
        : false;

      const isBRecommended = recommendations
        ? [
            ...(recommendations.filters || []),
            ...(recommendations.lights || []),
            ...(recommendations.substrates || []),
            ...(recommendations.otherProducts || []),
          ].some((rec) => rec.id === b.id)
        : false;

      // Nếu a được recommend mà b không, a lên đầu
      if (isARecommended && !isBRecommended) return -1;
      // Nếu b được recommend mà a không, b lên đầu
      if (!isARecommended && isBRecommended) return 1;
      // Nếu cả hai đều được recommend hoặc không, giữ nguyên thứ tự
      return 0;
    });
  };
  return (
    <>
      {/* Modal */}
      <div>
        <Modal
          open={isModalOpen}
          onClose={closeModal}
          disableEnforceFocus
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedCategoryName}</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                      <FiX size={24} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="rounded-full p-1 text-yellow-500 text-xl">⭐</span>
                    <p className="text-xl text-gray-800">: Các sản phẩm gợi ý setup dành cho bể</p>
                  </div>
                </div>
                <div className="px-6 pt-4">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="font-semibold">Chọn theo loại:</span>
                    {subCategories.map((subcat) => (
                      <button
                        key={subcat}
                        className={`px-6 py-1 rounded-full border ${
                          selectedSubcategory === subcat
                            ? "bg-green-200 text-green-700 border-green-500 font-semibold"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => setSelectedSubcategory(subcat)}
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                  {/* danh sách sản phẩm */}
                  <div className="px-6 pb-6">
                    {isLoading ? (
                      <Loading />
                    ) : filterProductsBySubcategory(products, selectedSubcategory).length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {sortProducts(filterProductsBySubcategory(products, selectedSubcategory)).map(
                          (prod: Product) => {
                            // Kiểm tra sản phẩm có trong recommendations không
                            const matchedRecommendation = prod.id
                              ? [
                                  ...(recommendations?.filters || []),
                                  ...(recommendations?.lights || []),
                                  ...(recommendations?.substrates || []),
                                  ...(recommendations?.otherProducts || []),
                                ].find((rec) => rec.id && rec.id.trim() === prod.id.trim())
                              : undefined;
                            // console.log("matach recomend", recommendations);
                            // console.log("matach pro ", prod.id);
                            // console.log("matach re", matchedRecommendation);

                            return (
                              <ProductCard key={prod.id}>
                                <div className="relative product-img">
                                  {matchedRecommendation && (
                                    <span className="absolute top-2 right-0 bg-white bg-opacity-80 rounded-full p-1 text-yellow-500 text-2xl">
                                      ⭐
                                    </span>
                                  )}
                                  <img src={prod.images[0]} alt={prod.productName} className="w-full h-auto" />
                                </div>
                                <div className="product-info">
                                  <h3 className="product-name">{prod.productName}</h3>
                                  <span className="new-price">{currencyFormat(prod.price)}</span>
                                  <span className="size">{prod.size}</span>
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
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <p>Không có sản phẩm nào.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
}
