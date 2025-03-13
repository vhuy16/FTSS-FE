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
    topText: "Hồ Cá Cảnh / Thủy Sinh",
    titleText: "Bộ Sưu Tập Hồ Cá Cao Cấp",
    bottomText: "sang trọng / đẳng cấp / hiện đại",
    buttonLink: "/product",
    buttonText: "Xem Ngay",
    imgSource: hero1,
  },
  {
    id: "banner-2",
    topText: "Hồ Cá Mini / Dễ Chăm Sóc",
    titleText: "Không Gian Xanh Trong Tầm Tay",
    bottomText: "nhỏ gọn / tinh tế / phù hợp mọi không gian",
    buttonLink: "/product",
    buttonText: "Khám Phá",
    imgSource: hero2,
  },
  {
    id: "banner-3",
    topText: "Hồ Cá Phong Thủy",
    titleText: "Mang Tài Lộc & May Mắn Đến Nhà",
    bottomText: "hút vượng khí / tăng tài lộc",
    buttonLink: "/product",
    buttonText: "Xem ngay",
    imgSource: hero3,
  },
  {
    id: "banner-4",
    topText: "Phụ Kiện Hồ Cá",
    titleText: "Đầy Đủ Phụ Kiện Cho Hồ Cá Hoàn Hảo",
    bottomText: "bơm oxy / đèn LED / máy lọc nước",
    buttonLink: "/product",
    buttonText: "Mua Ngay",
    imgSource: hero4,
  },
];
