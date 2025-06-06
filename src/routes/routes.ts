import Home from '@components/pages/Home/Home';
import { ComponentType } from 'react';
import AuthLayout from '@layouts/AuthLayout';
import Register from '@components/pages/Register/Register';
import VerifyAccount from '@components/pages/VerifyAccount/VerifyAccount';
import Login from '@components/pages/Login/Login';
import MainLayout from '@layouts/MainLayout';
import Product from '@components/pages/Product/Product';
import ProductDetail from '@components/pages/ProductDetail/ProductDetail';
import CartScreen from '@components/pages/Cart/Cart';
import ForgotPassword from '@components/pages/ForgotPassword/ForgotPassword';
import VerifyOTP from '@components/pages/ForgotPassword/VerifyOTP';
import ResetPassword from '@components/pages/ForgotPassword/ResetPassword';
import Account from '@components/pages/Account/Account';
import CheckoutScreen from '@components/pages/Checkout/Checkout';
import ConfirmScreen from '@components/pages/Checkout/PaymentSuccess';
import ErrorScreen from '@components/pages/Checkout/PaymentError';
import NotFoundScreen from '@components/pages/error/NotFoundScreen';
import Dashboard from '@components/pages/manager/Dashboad';
import AdminLayout from '@layouts/admin/AdminLayouts';
import OrderListScreen from '@components/pages/Order/OrderListScreen';
import OrderDetailScreen from '@components/pages/Order/OrderDetail';
import SetupList from '@components/pages/SetupList/SetupList';
import SetupDetail from '@components/pages/Setup/SetupDetail';
import BuildSetup from '@components/pages/Setup/BuildSetup';
import SetupShop from '@components/pages/SetupShop/SetupShop';
import SetupShopDetailScreen from '@components/pages/SetupShopDetail.tsx/SetupShopDetail';
import ListUser from '@components/pages/admin/ListUser';
import ManagerLayout from '@layouts/manager/ManagerLayout';
import ListOrder from '@components/pages/manager/ListOrder';
import ListProduct from '@components/pages/manager/ListProduct';
import ListSetUp from '@components/pages/manager/ListSetUp';
import OrderDetail from '@components/pages/manager/OrderDetail';
import ListCategory from '@components/pages/manager/ListCategory';
import ListSubCategory from '@components/pages/manager/ListSubCategory';
import ManagerProfiles from '@components/pages/manager/ManagerProfile';
import BookingService from '@components/pages/Booking/BookingService';
import SetupBookingList from '@components/pages/Booking/SetupBookingList';
import Calendar from '@components/pages/manager/Calendar';
import ListBooking from '@components/pages/manager/ListBooking';
import AddMissionBooking from '@components/pages/manager/AddMissionBooking';
import ListService from '@components/pages/manager/ListService';
import BookingDetail from '@components/pages/manager/BookingDetail';
import ListOrderDelivery from '@components/pages/manager/ListOrderDelivery';
import AddMissionOrder from '@components/pages/manager/AddMissionOrder';
import BookingHistoryDetail from '@components/pages/Booking/BookingHistoryDetail';
import IssueBlog from '@components/pages/Issue/IssueBlog';
import ListVoucher from '@components/pages/manager/ListVoucher';
import ListIssueCategory from '@components/pages/manager/ListIssueCategory';
import ListIssue from '@components/pages/manager/ListIssue';
import IssueBlogDetail from '@components/pages/Issue/IssueBlogDetail';
import BookingHistoryListSCreen from '@components/pages/Booking/BookingHistoryListSCreen';
import SetupBookingDetail from '@components/pages/Booking/SetupBookingDetail';
import UpdateBookingSetup from '@components/pages/Booking/UpdateBookingSetup';
import Chat from '@components/pages/manager/Chat';

export type RouteType = {
    path: string;
    component: ComponentType<any>;
    layout?: ComponentType<any> | null | undefined;
};
let publicRoute: RouteType[] = [];
const role = localStorage.getItem('role');
if (role === 'Admin') {
    publicRoute = [
        {
            path: '/',
            component: Home,
            layout: MainLayout,
        },
        {
            path: '/login',
            component: Login,
            layout: AuthLayout,
        },
        {
            path: '/register',
            component: Register,
            layout: AuthLayout,
        },
        {
            path: '/verify',
            component: VerifyAccount,
            layout: AuthLayout,
        },
        {
            path: '/forgot-password',
            component: ForgotPassword,
            layout: AuthLayout,
        },
        {
            path: '/verify-forgot-password',
            component: VerifyOTP,
            layout: AuthLayout,
        },
        {
            path: '/reset-password',
            component: ResetPassword,
            layout: AuthLayout,
        },

        {
            path: '/listUser',
            component: ListUser,
            layout: AdminLayout,
        },
        {
            path: '*',
            component: NotFoundScreen,
            layout: null,
        },
    ];
} else if (role === 'Manager') {
    publicRoute = [
        {
            path: '/',
            component: Home,
            layout: MainLayout,
        },
        {
            path: '/login',
            component: Login,
            layout: AuthLayout,
        },
        {
            path: '/register',
            component: Register,
            layout: AuthLayout,
        },
        {
            path: '/verify',
            component: VerifyAccount,
            layout: AuthLayout,
        },
        {
            path: '/forgot-password',
            component: ForgotPassword,
            layout: AuthLayout,
        },
        {
            path: '/verify-forgot-password',
            component: VerifyOTP,
            layout: AuthLayout,
        },
        {
            path: '/reset-password',
            component: ResetPassword,
            layout: AuthLayout,
        },
        {
            path: '/listOrder',
            component: ListOrder,
            layout: ManagerLayout,
        },
        {
            path: '/listOrder/:id',
            component: OrderDetail,
            layout: ManagerLayout,
        },
        {
            path: '/listProduct',
            component: ListProduct,
            layout: ManagerLayout,
        },
        {
            path: '/listSetup',
            component: ListSetUp,
            layout: ManagerLayout,
        },
        {
            path: '/listCategory',
            component: ListCategory,
            layout: ManagerLayout,
        },
        {
            path: '/listSubCategory',
            component: ListSubCategory,
            layout: ManagerLayout,
        },
        {
            path: '/dashboard',
            component: Dashboard,
            layout: ManagerLayout,
        },
        {
            path: '/manager/profile',
            component: ManagerProfiles,
            layout: ManagerLayout,
        },
        {
            path: '/calendar',
            component: Calendar,
            layout: ManagerLayout,
        },
        {
            path: '/addMissionBooking',
            component: AddMissionBooking,
            layout: ManagerLayout,
        },
        {
            path: '/addMissionOrder',
            component: AddMissionOrder,
            layout: ManagerLayout,
        },
        {
            path: '/listBooking',
            component: ListBooking,
            layout: ManagerLayout,
        },
        {
            path: '/listService',
            component: ListService,
            layout: ManagerLayout,
        },
        {
            path: '/listVoucher',
            component: ListVoucher,
            layout: ManagerLayout,
        },
        {
            path: '/listIssueCategory',
            component: ListIssueCategory,
            layout: ManagerLayout,
        },
        {
            path: '/listIssue',
            component: ListIssue,
            layout: ManagerLayout,
        },

        {
            path: '/listOrder-setup',
            component: ListOrderDelivery,
            layout: ManagerLayout,
        },
        {
            path: '/chat',
            component: Chat,
            layout: ManagerLayout,
        },
        {
            path: '/listBooking/:id',
            component: BookingDetail,
            layout: ManagerLayout,
        },
        {
            path: '*',
            component: NotFoundScreen,
            layout: null,
        },
    ];
} else if (role === 'Customer') {
    publicRoute = [
        {
            path: '/',
            component: Home,
            layout: MainLayout,
        },
        {
            path: '/login',
            component: Login,
            layout: AuthLayout,
        },
        {
            path: '/register',
            component: Register,
            layout: AuthLayout,
        },
        {
            path: '/verify',
            component: VerifyAccount,
            layout: AuthLayout,
        },
        {
            path: '/forgot-password',
            component: ForgotPassword,
            layout: AuthLayout,
        },
        {
            path: '/verify-forgot-password',
            component: VerifyOTP,
            layout: AuthLayout,
        },
        {
            path: '/reset-password',
            component: ResetPassword,
            layout: AuthLayout,
        },
        {
            path: '/cart',
            component: CartScreen,
            layout: MainLayout,
        },
        {
            path: '/product',
            component: Product,
            layout: MainLayout,
        },
        {
            path: '/product/:id',
            component: ProductDetail,
            layout: MainLayout,
        },
        {
            path: '/checkout',
            component: CheckoutScreen,
            layout: MainLayout,
        },
        {
            path: '/account',
            component: Account,
            layout: MainLayout,
        },
        {
            path: '/paymentSuccess',
            component: ConfirmScreen,
            layout: MainLayout,
        },
        {
            path: '/paymentError',
            component: ErrorScreen,
            layout: MainLayout,
        },
        {
            path: '/order',
            component: OrderListScreen,
            layout: MainLayout,
        },
        {
            path: '/order-detail/:orderId',
            component: OrderDetailScreen,
            layout: MainLayout,
        },
        {
            path: '*',
            component: NotFoundScreen,
            layout: null,
        },
        {
            path: '/setup-package/:setupPackageId',
            component: SetupDetail,
            layout: MainLayout,
        },
        {
            path: '/setup-package',
            component: SetupList,
            layout: MainLayout,
        },
        {
            path: '/setup-package-build',
            component: BuildSetup,
            layout: MainLayout,
        },
        {
            path: '/setup-package-shop',
            component: SetupShop,
            layout: MainLayout,
        },
        {
            path: '/setup-package-shop/:setupPackageId',
            component: SetupShopDetailScreen,
            layout: MainLayout,
        },
        {
            path: '/setup-booking/detail/:orderId',
            component: SetupBookingDetail,
            layout: MainLayout,
        },
        {
            path: '/setup-booking/service/:setupBookingId',
            component: BookingService,
            layout: MainLayout,
        },
        {
            path: '/setup-booking',
            component: SetupBookingList,
            layout: MainLayout,
        },
        {
            path: '/booking-setup-schedule/:orderId',
            component: UpdateBookingSetup,
            layout: MainLayout,
        },
        {
            path: '/booking-history',
            component: BookingHistoryListSCreen,
            layout: MainLayout,
        },
        {
            path: '/booking-detail/:id',
            component: BookingHistoryDetail,
            layout: MainLayout,
        },
        {
            path: '/issue-post',
            component: IssueBlog,
            layout: MainLayout,
        },
        {
            path: '/issue-post/:id',
            component: IssueBlogDetail,
            layout: MainLayout,
        },
    ];
} else {
    publicRoute = [
        {
            path: '/',
            component: Home,
            layout: MainLayout,
        },
        {
            path: '/login',
            component: Login,
            layout: AuthLayout,
        },
        {
            path: '/register',
            component: Register,
            layout: AuthLayout,
        },
        {
            path: '/verify',
            component: VerifyAccount,
            layout: AuthLayout,
        },
        {
            path: '/forgot-password',
            component: ForgotPassword,
            layout: AuthLayout,
        },
        {
            path: '/verify-forgot-password',
            component: VerifyOTP,
            layout: AuthLayout,
        },
        {
            path: '/reset-password',
            component: ResetPassword,
            layout: AuthLayout,
        },

        {
            path: '/product',
            component: Product,
            layout: MainLayout,
        },
        {
            path: '/product/:id',
            component: ProductDetail,
            layout: MainLayout,
        },

        {
            path: '*',
            component: NotFoundScreen,
            layout: null,
        },

        {
            path: '/setup-package-shop',
            component: SetupShop,
            layout: MainLayout,
        },
        {
            path: '/setup-package-shop/:setupPackageId',
            component: SetupShopDetailScreen,
            layout: MainLayout,
        },
        {
            path: '/issue-post',
            component: IssueBlog,
            layout: MainLayout,
        },
        {
            path: '/issue-post/:id',
            component: IssueBlogDetail,
            layout: MainLayout,
        },
    ];
}

const privateRoute: RouteType[] = [];

export { publicRoute, privateRoute };
