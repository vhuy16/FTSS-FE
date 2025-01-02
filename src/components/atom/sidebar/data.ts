interface SideMenuItem {
    id: string;
    menuLink: string;
    menuText: string;
    iconName: string;
}

export const sideMenuData: SideMenuItem[] = [
    {
        id: 'side-menu-1',
        menuLink: '/',
        menuText: 'Trang Chủ',
        iconName: 'house',
    },
    {
        id: 'side-menu-2',
        menuLink: '/product',
        menuText: 'Sản Phẩm',
        iconName: 'grid-fill',
    },
    {
        id: 'side-menu-3',
        menuLink: '/wishlist',
        menuText: 'Yêu Thích',
        iconName: 'heart',
    },
    {
        id: 'side-menu-4',
        menuLink: '/account',
        menuText: 'Thông Tin ',
        iconName: 'person-fill',
    },
    {
        id: 'side-menu-5',
        menuLink: '/cart',
        menuText: 'Giỏ Hàng',
        iconName: 'bag-check-fill',
    },
];
