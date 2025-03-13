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
    menuText: "Trang Chủ",
    iconName: "house",
  },
  {
    id: "side-menu-2",
    menuLink: "/product",
    menuText: "Sản Phẩm",
    iconName: "grid-fill",
  },

  {
    id: "side-menu-4",
    menuLink: "/account",
    menuText: "Thông Tin ",
    iconName: "person-fill",
  },
  {
    id: "side-menu-5",
    menuLink: "/cart",
    menuText: "Giỏ Hàng",
    iconName: "bag-check-fill",
  },
  {
    id: "side-menu-6",
    menuLink: "/setup-package-shop",
    menuText: "Hồ Cá",
    iconName: "water",
  },
  {
    id: "side-menu-7",
    menuLink: "/setup-package",
    menuText: "Hồ Cá Của Tôi",
    iconName: "tools",
  },
];
