// import MainLayout from "@layouts/MainLayout";

import Home from "@components/pages/Home/Home";
import { ComponentType } from "react";
import AuthLayout from "@layouts/AuthLayout";
import Register from "@components/pages/Register/Register";
import VerifyAccount from "@components/pages/VerifyAccount/VerifyAccount";
import Login from "@components/pages/Login/Login";
import MainLayout from "@layouts/MainLayout";
import Product from "@components/pages/Product/Product";
import ProductDetail from "@components/pages/ProductDetail/ProductDetail";
import CartScreen from "@components/pages/Cart/Cart";

export type RouteType = {
  path: string;
  component: ComponentType<any>;
  layout?: ComponentType<any> | null | undefined;
};

const publicRoute: RouteType[] = [
  {
    path: "/",
    component: Home,
    layout: MainLayout,
  },
  {
    path: "/login",
    component: Login,
    layout: AuthLayout,
  },
  {
    path: "/register",
    component: Register,
    layout: AuthLayout,
  },
  {
    path: "/verify",
    component: VerifyAccount,
    layout: AuthLayout,
  },
  {
    path: "/cart",
    component: CartScreen,
    layout: MainLayout,
  },
  {
    path: "/product",
    component: Product,
    layout: MainLayout,
  },
  {
    path: "/product/:id",
    component: ProductDetail,
    layout: MainLayout,
  },
];

const privateRoute: RouteType[] = [];

export { publicRoute, privateRoute };
