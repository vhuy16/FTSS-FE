// import MainLayout from "@layouts/MainLayout";
import Home from '@components/pages/Home';
import { ComponentType } from 'react';
import AuthLayout from '@layouts/AuthLayout';
import Login from '@components/pages/Login';

export type RouteType = {
    path: string;
    component: ComponentType<any>;
    layout?: ComponentType<any> | null | undefined;
};

const publicRoute: RouteType[] = [
    {
        path: '/',
        component: Home,
        layout: null,
    },
    {
        path: '/login',
        component: Login,
        layout: AuthLayout,
    },
];

const privateRoute: RouteType[] = [];

export { publicRoute, privateRoute };
