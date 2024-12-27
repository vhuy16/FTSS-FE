import { staticImages } from '@ultils/images';

const footerData = [
    {
        id: 'f_need_help',
        title: 'Need Help',
        links: [
            { text: 'Contact Us', url: '/contact' },
            { text: 'Track Order', url: '/track_order' },
            { text: 'Returns & Refunds', url: '/returns_refunds' },
            { text: "FAQ's", url: '/faqs' },
            { text: 'Career', url: '/career' },
        ],
    },
    {
        id: 'f_company',
        title: 'Company',
        links: [
            { text: 'About Us', url: '/contact' },
            { text: 'Achats Blog', url: '/blog' },
            { text: 'Achatsian', url: '/achatsian' },
            { text: 'Collaboration', url: '/collaboration' },
            { text: 'Media', url: '/media' },
        ],
    },
    {
        id: 'f_more_info',
        title: 'More info',
        links: [
            { text: 'Terms and conditions', url: '/tac' },
            { text: 'Privacy Policy', url: '/privacy' },
            { text: 'Shipping Policy', url: '/shipping' },
            { text: 'Sitemap', url: '/sitemap' },
        ],
    },
    {
        id: 'f_location',
        title: 'Location',
        lists: [
            { text: 'Tsupport@euphoria.in' },
            { text: 'Highland Strett, A04 Street 4014' },
            { text: 'New York City, USA' },
            { text: 'Phone: +000 999 8888' },
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
