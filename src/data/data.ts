import { staticImages } from '@ultils/images';

const footerData = [
    {
        id: 'f_need_help',
        title: 'Cần hỗ trợ',
        links: [
            { text: 'Liên hệ', url: '/contact' },
            { text: 'Theo dõi đơn hàng', url: '/track_order' },
            { text: 'Đổi trả & Hoàn tiền', url: '/returns_refunds' },
            { text: 'Câu hỏi thường gặp', url: '/faqs' },
        ],
    },
    {
        id: 'f_company',
        title: 'Về chúng tôi',
        links: [
            { text: 'Giới thiệu', url: '/contact' },
            { text: 'Blog thủy sinh', url: '/blog' },
            { text: 'Cộng đồng thủy sinh', url: '/achatsian' },
        ],
    },
    {
        id: 'f_more_info',
        title: 'Thông tin thêm',
        links: [
            { text: 'Điều khoản & Điều kiện', url: '/tac' },
            { text: 'Chính sách bảo mật', url: '/privacy' },
            { text: 'Chính sách vận chuyển', url: '/shipping' },
        ],
    },
    {
        id: 'f_location',
        title: 'Liên hệ & Địa chỉ',
        lists: [
            { text: 'fpt@edu.vn' },
            { text: 'Hồ Chí Minh, Q9' },
            { text: 'Việt Nam' },
            { text: 'Điện thoại: +000 999 8888' },
        ],
    },
];
const socialLinksData = [
    {
        id: 'social_link_1',
        site_name: 'facebook',
        site_icon: 'bi bi-facebook',
        site_url: 'www.facbook.com',
    },
    {
        id: 'social_link_2',
        site_name: 'instagram',
        site_icon: 'bi bi-instagram',
        site_url: 'www.instagram.com',
    },
    {
        id: 'social_link_3',
        site_name: 'twitter',
        site_icon: 'bi bi-twitter',
        site_url: 'www.twitter.com',
    },
    {
        id: 'social_link_4',
        site_name: 'linkedin',
        site_icon: 'bi bi-linkedin',
        site_url: 'www.linkedin.com',
    },
];

export { footerData, socialLinksData };
