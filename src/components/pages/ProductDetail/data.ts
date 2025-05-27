// Define types for the product object
import card_icon from '@icons/card_icon.svg';
import size_icon from '@icons/size_icon.svg';
import shipping_icon from '@icons/shipping_icon.svg';
import return_icon from '@icons/return_icon.svg';
interface PreviewImage {
    id: string;
}

interface Product {
    id: string;
    title: string;
    previewImages: PreviewImage[];
    rating: number;
    comments_count: number;
    sizes: string[];
    colors: string[];
    price: number;
}
interface TabHead {
    id: string;
    tabHead: string;
    tabText: string;
    badgeValue: number | null;
    badgeColor: string;
}

export const productDescriptionTabHeads: TabHead[] = [
    {
        id: 'tab-description',
        tabHead: 'tabDescription',
        tabText: 'Mô tả',
        badgeValue: null,
        badgeColor: '',
    },
];

// Define the product_one object using the Product interface
export const product_one: Product = {
    id: 'product_01',
    title: 'Raven Hoodie With Black Colored Design',
    previewImages: [
        {
            id: 'preview1',
        },
        {
            id: 'preview2',
        },
        {
            id: 'preview3',
        },
        {
            id: 'preview4',
        },
        {
            id: 'preview5',
        },
    ],
    rating: 3.5,
    comments_count: 120,
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    colors: ['#3C4242', '#EDD146', '#EB84B0', '#9C1F35'],
    price: 63.0,
};
interface Service {
    id: string; // Change to string as IDs are strings in your data
    icon: string; // Assuming icon paths are strings
    text: string;
}

export const servicesData: Service[] = [
    {
        id: 'service_1',
        icon: card_icon,
        text: 'Thanh toán online',
    },
    {
        id: 'service_2',
        icon: size_icon,
        text: 'Sản phẩm đa dạng',
    },
    {
        id: 'service_3',
        icon: shipping_icon,
        text: 'Giao hàng tận nơi',
    },
    {
        id: 'service_4',
        icon: return_icon,
        text: 'Miễn phí đổi trả',
    },
];
