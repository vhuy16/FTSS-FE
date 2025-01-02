import hero1 from "@images/hero1.jpg";
import hero2 from "@images/hero1.jpg";
import hero3 from "@images/hero1.jpg";
import hero4 from "@images/hero1.jpg";
// Định nghĩa kiểu cho một banner
interface Banner {
  id: string;
  topText: string;
  titleText: string;
  bottomText: string;
  buttonLink: string;
  buttonText: string;
  imgSource: string; // Giả sử imgSource là đường dẫn dạng string
}

// Mảng chứa dữ liệu banner
export const bannerData: Banner[] = [
  {
    id: "banner-1",
    topText: "Quà Tặng / Đồ Handmade",
    titleText: "Bộ sưu tập Giá Trị Mùa Hè",
    bottomText: "độc đáo / đầy màu sắc / tiện dụng",
    buttonLink: "/",
    buttonText: "Mua Ngay",
    imgSource: hero1,
  },
  {
    id: "banner-2",
    topText: "Chất Lượng / Thương Hiệu",
    titleText: "Mùa Khuyến Mãi",
    bottomText: "ưu đãi / giảm giá lớn / mã giảm giá",
    buttonLink: "/",
    buttonText: "Mua Ngay",
    imgSource: hero2,
  },
  {
    id: "banner-3",
    topText: "Khung Ảnh / Bộ Sưu Tập",
    titleText: "Hàng Mới & Đặc Biệt",
    bottomText: "thời trang / phong cách",
    buttonLink: "/",
    buttonText: "Mua Ngay",
    imgSource: hero3,
  },
  {
    id: "banner-4",
    topText: "Kẹp tóc & Móc Khóa",
    titleText: "Lựa Chọn Thời Trang Cho Dịp Đặc Biệt",
    bottomText: "ưu đãi / giảm giá / mã giảm giá",
    buttonLink: "/",
    buttonText: "Mua Ngay",
    imgSource: hero4,
  },
];
