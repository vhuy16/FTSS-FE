interface SideMenuItem {
  id: string;
  menuLink: string;
  menuText: string;
  iconName: string;
}

export const sideMenuData: SideMenuItem[] = [
  {
    id: "side-menu-1",
    menuLink: "/",
    menuText: "Trang chủ",
    iconName: "house",
  },
  {
    id: "side-menu-2",
    menuLink: "/product",
    menuText: "Sản phẩm",
    iconName: "grid-fill",
  },

  {
    id: "side-menu-4",
    menuLink: "/account",
    menuText: "Thông tin ",
    iconName: "person-fill",
  },
  {
    id: "side-menu-5",
    menuLink: "/cart",
    menuText: "Giỏ hàng",
    iconName: "bag-check-fill",
  },
  {
    id: "side-menu-6",
    menuLink: "/setup-package-shop",
    menuText: "Hồ cá",
    iconName: "water",
  },
  {
    id: "side-menu-7",
    menuLink: "/setup-package",
    menuText: "Hồ cá của tôi",
    iconName: "tools",
  },
  {
    id: "side-menu-8",
    menuLink: "/issue-post",
    menuText: "Bài viết",
    iconName: "file-text",
  },
];
